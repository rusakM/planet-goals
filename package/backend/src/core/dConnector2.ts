import { Condition } from 'dynamoose/dist/Condition';
import cron from 'node-cron';
import { Model as dbModel } from 'dynamoose/dist/Model';
import { Query, QueryResponse, Scan, ScanResponse } from 'dynamoose/dist/ItemRetriever';

import { RedisConnector } from '.';
import * as errorsAdapter from '../core/errorAdapter';
import { AnyItem } from 'dynamoose/dist/Item';
import { SchemasGlobal } from '../models';
import { ConstantsGlobal } from './constants';

import { Logger } from '../services/logger.service';
const logger = Logger('core/dbConnector');
interface IDbConnector<IModel, TIndexes extends string> {
    /**
     * Create a new item in the database.
     * @param payload - The item to create.
     * @returns A promise that resolves to the created item or null.
     */
    create: (payload: IModel) => Promise<IModel | null>;

    /**
     * Update an item in the database.
     * @param id - The ID of the item to update.
     * @param payload - The updated item data.
     * @returns A promise that resolves to the updated item or null.
     */
    update: (id: string, payload: IModel) => Promise<IModel | null>;

    /**
     * Completly replaces an existing item in the database.
     * @param id - The ID of the item to replace.
     * @param payload - The replacement item.
     * @returns A promise that resolves to the updated item or null.
     */
    replace: (id: string, payload: IModel) => Promise<IModel | null>;

    /**
     * Delete an item from the database.
     * @param id - The ID of the item to delete.
     * @returns A promise that resolves to a boolean indicating success or failure.
     */
    delete: (id: string) => Promise<boolean>;

    /**
     * Find methods for various query operations.
     */
    Find: IFindMethods<IModel, TIndexes>;

    /**
     * Get methods.
     */
    Get: IGetMethods<IModel>;

    /**
     * More methods.
     */
    AdditionalMethods: IAdditionalMethods<TIndexes>;
}

export interface IFindMethods<IModel, TIndexes extends string> {
    /**
     * Find an item by its ID.
     * @param id - The ID of the item to find.
     * @returns A promise that resolves to the found item or null.
     */
    byId: (id: string) => Promise<IModel>;

    /**
     * Find items by a specific indexed key and value.
     * @param key - An indexed key to query.
     * @param value - The value to match.
     * @param limit - The maximum number of items to return.
     * @returns A promise that resolves to an array of found items or an optional single item when limit is set to 1.
     */
    byIndex: {
        (key: TIndexes, value: string, limit: 1): Promise<IModel | undefined>;
        (key: TIndexes, value: string, limit?: number): Promise<IModel[]>;
    };

    /**
     * Find items by a specific indexed key and value with additional key value pairs filters.
     * @param key - An indexed key to query.
     * @param value - The value to match.
     * @param filters - The key-value pairs for additional filters.
     * @param limit - The maximum number of items to return.
     * @returns A promise that resolves to an array of found items or an optional single item when limit is set to 1.
     */
    byIndexWithFilters: {
        (key: TIndexes, value: string, filters: { [key in keyof IModel]?: string }, limit: 1): Promise<IModel | undefined>;
        (key: TIndexes, value: string, filters: { [key in keyof IModel]?: string }, limit?: number): Promise<IModel[]>;
    };

    /**
     * Find items by query conditions.
     * @param conditions - The conditions to query.
     * @param limit - The maximum number of items to return.
     * @returns A promise that resolves to an array of found items or an optional single item when limit is set to 1.
     */
    byQuery: {
        (conditions: Condition, limit: 1): Promise<IModel | undefined>;
        (conditions: Condition, limit?: number): Promise<IModel[]>;
    };

    /**
     * Scan for items by conditions.
     * @param conditions - The conditions to scan.
     * @param limit - The maximum number of items to return.
     * @returns A promise that resolves to an array of found items or an optional single item when limit is set to 1.
     */
    byScan: {
        (conditions: Condition | { [key in keyof IModel]?: string }, limit: 1): Promise<IModel | undefined>;
        (conditions: Condition | { [key in keyof IModel]?: string }, limit?: number): Promise<IModel[]>;
    };

    /**
     * Find items within a date range.
     * @param key - The key to scan.
     * @param startDate - The start date of the range.
     * @param endDate - The end date of the range.
     * @param limit - The maximum number of items to return.
     * @returns A promise that resolves to an array of found items or an optional single item when limit is set to 1.
     */
    byDateRange: {
        (key: keyof IModel, startDate: string, endDate: string, limit: 1): Promise<IModel | undefined>;
        (key: keyof IModel, startDate: string, endDate: string, limit?: number): Promise<IModel[]>;
    };

    /**
     * Find items by a partial key value.
     * @param key - The key to scan.
     * @param partialValue - The partial value to match.
     * @returns A promise that resolves to an array of found items or an optional single item when limit is set to 1.
     */
    byPartialKey: {
        (key: keyof IModel, partialValue: string, limit: 1): Promise<IModel | undefined>;
        (key: keyof IModel, partialValue: string, limit?: number): Promise<IModel[]>;
    };
}

interface IGetMethods<IModel> {
    /**
     * Retrieve all items from the database.
     * @returns A promise that resolves to an array of all items.
     */
    all: () => Promise<IModel[]>;

    /**
     * Retrieves multiple items from the database based on the provided IDs.
     * @param ids - An array of item IDs to fetch from the database.
     * @returns A promise that resolves to an array of items matching the given IDs.
     */
    batch: (ids: string[]) => Promise<IModel[]>;
}

interface IAdditionalMethods<TIndexes extends string> {
    /**
     * Count the number of items that match a specific key-value pair.
     * @param key - The key to query.
     * @param value - The value to match.
     * @returns A promise that resolves to the count of matching items.
     */
    countBy: (key: TIndexes, value: string) => Promise<number>;
}

interface IConnectorOptions {
    ttl?: number; // number of miliseconds to expire record from Date.now()
}

/**
 * Database connector class for managing database operations.
 */
export class DbConnector<IModel, TIndexes extends string> implements IDbConnector<IModel, TIndexes> {
    protected Model: dbModel;
    protected errorMsg: string;
    protected options: IConnectorOptions;

    constructor(Model: dbModel, options?: IConnectorOptions) {
        this.Model = Model;
        this.errorMsg = `Error db (table: ${this.Model.name}) - `;
        if (options) this.options = options;
    }

    protected async withLimit(fetchRequest: Query<AnyItem> | Scan<AnyItem>, limit: number) {
        let records: AnyItem[] = [];
        let lastKey;

        while (records.length < limit) {
            const result: QueryResponse<AnyItem> | ScanResponse<AnyItem> = await fetchRequest.startAt(lastKey).exec();
            records = [...records, ...result];
            lastKey = result.lastKey;
            if (!lastKey) break;
        }
        return records.slice(0, limit);
    }

    protected testPayloadSize(payloadSize: number, operation: 'create' | 'update' | 'replace'): void {
        if (payloadSize > ConstantsGlobal.FixiApplications.Database.REQUEST_LIMITS_IN_KB.ERROR * 1024) {
            throw new Error(`Payload for ${operation} operation exceeds ${ConstantsGlobal.FixiApplications.Database.REQUEST_LIMITS_IN_KB.ERROR}KB (size: ${payloadSize} bytes)`);
        } else if (payloadSize > ConstantsGlobal.FixiApplications.Database.REQUEST_LIMITS_IN_KB.WARNING * 1024) {
            logger.warn(`Payload for ${operation} operation exceeds ${ConstantsGlobal.FixiApplications.Database.REQUEST_LIMITS_IN_KB.WARNING}KB (size: ${payloadSize} bytes)`);
        }
    }

    async create(payload: IModel): Promise<IModel> {
        try {
            this.testPayloadSize(JSON.stringify(payload)?.length, 'create');
            return (await this.Model.create(payload)) as IModel;
        } catch (error) {
            const payloadJson = JSON.stringify(payload);
            logger.silly(`${this.errorMsg} payload: `, payloadJson);
            if (error?.message?.startsWith('Payload for')) logger.error(error);
            else logger.error(`${this.errorMsg} creating item:`, error);
            throw errorsAdapter.Core.createError(errorsAdapter.Core.ErrorsEnum.DATABASE_OPERATION_ERROR, { table: this.Model.name, operation: 'create', payload: payloadJson });
        }
    }

    async update(documentId: string, payload: Partial<IModel> & { id?: string; createdAt?: string | Date; updatedAt?: string; ttl?: number }): Promise<IModel> {
        try {
            if (!documentId) throw new Error('"id" is required.');
            if (!payload) throw new Error('"payload" is required.');
            if (this.options?.ttl) payload.ttl = Math.floor((new Date().getTime() + this.options.ttl) / 1000);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { createdAt, id, updatedAt, ...updateData } = payload;
            this.testPayloadSize(JSON.stringify(updateData).length, 'update');
            const updatedItem = await this.Model.update(documentId, { ...updateData });

            return updatedItem as IModel;
        } catch (error) {
            const payloadJson = JSON.stringify(payload);
            logger.silly(`${this.errorMsg} update (id: ${documentId}):`, JSON.stringify(payloadJson));
            if (error?.message?.startsWith('Payload for')) logger.error(error);
            else logger.error('Error updating item:', error);
            throw errorsAdapter.Core.createError(errorsAdapter.Core.ErrorsEnum.DATABASE_OPERATION_ERROR, { table: this.Model.name, operation: 'update', documentId, payload: payloadJson });
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            if (!id) throw new Error('"id" is required.');

            const existingItem = await this.Model.get(id);
            if (!existingItem) return false;

            await existingItem.delete();
            return true;
        } catch (error) {
            logger.error(`${this.errorMsg} deleting item (id: ${id}):`, error);
            throw errorsAdapter.Core.createError(errorsAdapter.Core.ErrorsEnum.DATABASE_OPERATION_ERROR, { table: this.Model.name, operation: 'delete', id });
        }
    }

    async replace(documentId: string, payload: IModel & { id?: string; createdAt?: string | Date; updatedAt?: string; ttl?: number }): Promise<IModel> {
        try {
            if (!documentId) throw new Error('"id" is required.');
            payload.id = documentId;

            this.testPayloadSize(JSON.stringify(payload)?.length, 'replace');

            if (this.options?.ttl) (payload as any).ttl = Math.floor((new Date().getTime() + this.options.ttl) / 1000);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { updatedAt, ...updateData } = payload;

            const replacedItem = (await this.Model.create(updateData, { overwrite: true })) as IModel;
            return replacedItem;
        } catch (error) {
            const payloadJson = JSON.stringify(payload);
            logger.silly(`${this.errorMsg} replace (id: ${documentId}):`, JSON.stringify(payloadJson));
            if (error?.message?.startsWith('Payload for')) logger.error(error);
            else logger.error('Error replacing item:', error);
            throw errorsAdapter.Core.createError(errorsAdapter.Core.ErrorsEnum.DATABASE_OPERATION_ERROR, { table: this.Model.name, operation: 'update', documentId, payload: payloadJson });
        }
    }

    Find: IFindMethods<IModel, TIndexes> = {
        byId: async (id: string) => {
            try {
                if (!id) throw new Error('"id" is required.');
                return (await this.Model.get(id)) as IModel;
            } catch (error) {
                logger.error(`${this.errorMsg} finding by id (id: ${id}):`, error);
                throw errorsAdapter.Core.createError(errorsAdapter.Core.ErrorsEnum.DATABASE_OPERATION_ERROR, { table: this.Model.name, operation: 'Find byId', id });
            }
        },

        byIndex: async (key: TIndexes, value: string, limit: number = 0) => {
            try {
                if (!value) throw new Error(`Value "${value}" for ${key} is required.`);

                const query = this.Model.query(key).eq(value).using(SchemasGlobal.Index.createIndexName(key));

                const result = (await (limit > 0 ? this.withLimit(query, limit) : query.all().exec())) as IModel[] | any[];

                return limit === 1 ? result?.[0] : result;
            } catch (error) {
                logger.error(`${this.errorMsg} byKey (key:${key} value: ${value}):`, error);
                throw errorsAdapter.Core.createError(errorsAdapter.Core.ErrorsEnum.DATABASE_OPERATION_ERROR, { table: this.Model.name, operation: 'Find byIndex', key, value });
            }
        },

        byIndexWithFilters: async (key: TIndexes, value: string, filters: { [key in keyof IModel]?: string }, limit: number = 0) => {
            try {
                if (!value) throw new Error(`Value "${value}" for ${key} is required.`);

                const query = this.Model.query(key).eq(value).using(SchemasGlobal.Index.createIndexName(key));
                for (const key in filters) {
                    if (filters[key]) {
                        query.and().filter(key).eq(filters[key]);
                    }
                }

                const result = (await (limit > 0 ? this.withLimit(query, limit) : query.all().exec())) as IModel[] | any[];

                return limit === 1 ? result?.[0] : result;
            } catch (error) {
                logger.error(`${this.errorMsg} byKey (key:${key} value: ${value}):`, error);
                throw errorsAdapter.Core.createError(errorsAdapter.Core.ErrorsEnum.DATABASE_OPERATION_ERROR, { table: this.Model.name, operation: 'Find byIndex', key, value });
            }
        },

        byQuery: async (conditions: Condition, limit: number = 0) => {
            try {
                if (!conditions) throw new Error('"conditions" is required.');
                const query = this.Model.query(conditions);

                const result = (await (limit > 0 ? this.withLimit(query, limit) : query.all().exec())) as IModel[] | any[];

                return limit === 1 ? result?.[0] : result;
            } catch (error) {
                const conditionsJson = JSON.stringify(conditions);
                logger.silly(`${this.errorMsg} byQuery conditions: `, conditionsJson);
                logger.error(`${this.errorMsg} byQuery`, error);
                throw errorsAdapter.Core.createError(errorsAdapter.Core.ErrorsEnum.DATABASE_OPERATION_ERROR, { table: this.Model.name, operation: 'Find byQuery', conditions: conditionsJson });
            }
        },

        byScan: async (conditions: Condition | { [key in keyof IModel]?: string }, limit: number = 0) => {
            try {
                const conditionsIsValid = conditions && (conditions instanceof Condition || Object.keys(conditions).length > 0);
                if (!conditionsIsValid) throw new Error('"conditions" is required and cannot be an empty object.');

                const scan = this.Model.scan(conditions);

                const result = (await (limit > 0 ? this.withLimit(scan, limit) : scan.all().exec())) as IModel[] | any[];

                return limit === 1 ? result?.[0] : result;
            } catch (error) {
                const conditionsJson = JSON.stringify(conditions);
                logger.silly(`${this.errorMsg} byScan conditions: `, conditionsJson);
                logger.error(`${this.errorMsg} by scan`, error);
                throw errorsAdapter.Core.createError(errorsAdapter.Core.ErrorsEnum.DATABASE_OPERATION_ERROR, { table: this.Model.name, operation: 'Find byScan', conditions: conditionsJson });
            }
        },

        byDateRange: async (key: keyof IModel, startDate: string, endDate: string, limit: number = 0) => {
            try {
                if (!startDate || !endDate) throw new Error('"startDate" and "endDate" are required.');
                const scan = this.Model.scan(String(key)).between(startDate, endDate);

                const result = (await (limit > 0 ? this.withLimit(scan, limit) : scan.all().exec())) as IModel[] | any[];

                return limit === 1 ? result?.[0] : result;
            } catch (error) {
                logger.silly(`${this.errorMsg} byDateRange key: ${String(key)}, startDate: ${startDate}, endDate: ${endDate}`);
                logger.error(`${this.errorMsg} by dateRange`, error);
                throw errorsAdapter.Core.createError(errorsAdapter.Core.ErrorsEnum.DATABASE_OPERATION_ERROR, { table: this.Model.name, operation: 'Find byDateRange', startDate, endDate });
            }
        },

        byPartialKey: async (key: keyof IModel, partialValue: string, limit: number = 0) => {
            try {
                if (!partialValue) throw new Error(`Partial value "${partialValue}" for ${String(key)} is required.`);
                const scan = this.Model.scan(String(key)).contains(partialValue);

                const result = (await (limit > 0 ? this.withLimit(scan, limit) : scan.all().exec())) as IModel[] | any[];

                return limit === 1 ? result?.[0] : result;
            } catch (error) {
                logger.silly(`${this.errorMsg} byPartialKey key: ${String(key)}, partialValue: ${partialValue}`);
                logger.error(`${this.errorMsg} by partialKey`, error);
                throw errorsAdapter.Core.createError(errorsAdapter.Core.ErrorsEnum.DATABASE_OPERATION_ERROR, { table: this.Model.name, operation: 'Find byPartialKey', key, partialValue });
            }
        },
    };

    Get = {
        all: async (): Promise<IModel[]> => {
            try {
                const result = (await this.Model.scan().all().exec()) as IModel[] | any[];
                return result?.length ? result : [];
            } catch (error) {
                logger.error(`${this.errorMsg} Get All:`, error);
                throw errorsAdapter.Core.createError(errorsAdapter.Core.ErrorsEnum.DATABASE_OPERATION_ERROR, { table: this.Model.name, operation: 'Get All' });
            }
        },
        batch: async (ids: string[]): Promise<IModel[]> => {
            try {
                const uniqueIds = Array.from(new Set(ids));

                const MAX_BATCH_SIZE = 100;

                const chunkArray = <T>(array: T[], size: number): T[][] => {
                    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) => array.slice(i * size, i * size + size));
                };

                const chunks = chunkArray(uniqueIds, MAX_BATCH_SIZE);
                let results: IModel[] = [];

                for (const chunk of chunks) {
                    const response = (await this.Model.batchGet(chunk)) as IModel[] | any[];
                    if (response?.length) {
                        results = results.concat(response);
                    }
                }

                return results.length ? results : [];
            } catch (error) {
                logger.silly(`[Error]: ${this.errorMsg} | Get Batch Ids: ${ids?.join(',') || ids}`);
                logger.error(`${this.errorMsg} Get Batch:`, error);
                throw errorsAdapter.Core.createError(errorsAdapter.Core.ErrorsEnum.DATABASE_OPERATION_ERROR, { table: this.Model.name, operation: 'Get Batch' });
            }
        },
    };

    AdditionalMethods = {
        countBy: async (key: TIndexes, value: string): Promise<number> => {
            try {
                if (!key) throw new Error('"key" is required.');
                if (!value) throw new Error('"value" is required.');

                const result = await this.Model.query(key).eq(value).count().exec();
                return result?.count ?? 0;
            } catch (error) {
                logger.error(`${this.errorMsg} countBy (key: ${key}, value: ${value}):`, error);
                throw errorsAdapter.Core.createError(errorsAdapter.Core.ErrorsEnum.DATABASE_OPERATION_ERROR, { table: this.Model.name, operation: 'count By', key, value });
            }
        },
    };
}

interface IDbConnectorUser<IModel, TIndexes extends string> {
    /**
     * Find methods for various query operations.
     */
    Find: IFindMethodsUser<IModel, TIndexes>;
}

interface IFindMethodsUser<IModel, TIndexes extends string> extends IFindMethods<IModel, TIndexes> {
    /**
     * Find a user by their email.
     * @param email - The email of the user to find.
     * @returns A promise that resolves to the found user or null.
     */
    byEmail: (id: string) => Promise<IModel>;
}

/**
 * Database connector class for user-specific database operations.
 */
export class DbConnectorUser<IModel, TIndexes extends string> extends DbConnector<IModel, TIndexes> implements IDbConnectorUser<IModel, TIndexes> {
    constructor(Model: dbModel) {
        super(Model);
    }

    create(payload: IModel): Promise<IModel> {
        payload = {
            ...payload,
            ...(this.hasEmail(payload) && { email: payload.email.toLowerCase() }),
        };
        return super.create(payload);
    }

    update(id: string, payload: IModel): Promise<IModel> {
        payload = {
            ...payload,
            ...(this.hasEmail(payload) && { email: payload.email.toLowerCase() }),
        };
        return super.update(id, payload);
    }

    private hasEmail(payload: any): payload is { email: string } {
        return 'email' in payload && typeof payload.email === 'string';
    }

    /**
     * Find methods for user-specific query operations.
     */
    Find: IFindMethodsUser<IModel, TIndexes> = {
        ...this.Find,

        byEmail: async (email: string): Promise<IModel | null> => {
            try {
                if (!email) throw new Error('"email" is required.');

                const result = (await this.Model.query('email').eq(email.toLowerCase()).using('email-index').limit(1).exec()) as IModel[] | any[];

                return result?.[0] || null;
            } catch (error) {
                logger.error(`${this.errorMsg} finding by email (email: ${email}):`, error);
                throw errorsAdapter.Core.createError(errorsAdapter.Core.ErrorsEnum.DATABASE_OPERATION_ERROR, { table: this.Model.name, operation: 'Find ByEmail', email });
            }
        },
    };
}

export type TRecordUpdateMode = 'CACHE' | 'CACHE_AND_DB' | 'DB';
interface IDbConnectorCache<IModel> {
    update: (id: string, payload: IModel, updateMode?: TRecordUpdateMode) => Promise<IModel | null>;
}

interface IFindMethodsCacheExtended<IModel, TIndexes extends string> extends IFindMethods<IModel, TIndexes> {
    byId: (id: string, useCache?: boolean) => Promise<IModel>;

    byIndex: {
        (key: TIndexes, value: string, limit: 1, useCache?: boolean): Promise<IModel | undefined>;
        (key: TIndexes, value: string, limit?: number, useCache?: boolean): Promise<IModel[]>;
    };
}

export class DbConnectorCache<IModel, TIndexes extends string> extends DbConnector<IModel, TIndexes> implements IDbConnectorCache<IModel> {
    Cache: RedisConnector<IModel>;
    syncJob: cron.ScheduledTask;
    constructor(Model: dbModel, cacheKeySuffix: string, cacheTTLInSek?: number, cacheSyncInterval?: number, connectorOptions?: IConnectorOptions) {
        super(Model, connectorOptions);
        this.Cache = new RedisConnector<IModel>(cacheKeySuffix, cacheTTLInSek, cacheSyncInterval);
        if (cacheSyncInterval > 0 && cacheSyncInterval < 60) this.syncJob = cron.schedule(`*/${cacheSyncInterval || 1} * * * *`, this.syncCacheToDb);
    }

    async create(payload: IModel, useCache: boolean = true): Promise<IModel> {
        try {
            const payloadDb = (await this.Model.create(payload)) as IModel;
            if (!useCache) return payloadDb;
            return await this.Cache.save(payloadDb);
        } catch (error) {
            const payloadJson = JSON.stringify(payload);
            console.log(`${this.errorMsg} payload: `, payloadJson);
            console.error(`${this.errorMsg} creating item:`, error);
            throw errorsAdapter.Core.createError(errorsAdapter.Core.ErrorsEnum.DATABASE_OPERATION_ERROR, { table: this.Model.name, operation: 'create', payload: payloadJson });
        }
    }

    async update(documentId: string, payload: Partial<IModel> & { id?: string; createdAt?: string | Date; updatedAt?: string; ttl?: number }, updateMode: TRecordUpdateMode = 'CACHE_AND_DB'): Promise<IModel> {
        try {
            if (!documentId) throw new Error('"id" is required.');
            if (!payload) throw new Error('"payload" is required.');
            if (this.options?.ttl > 0) payload.ttl = Math.floor((new Date().getTime() + this.options.ttl) / 1000);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { createdAt, id, updatedAt, ...updateData } = payload;
            let updatedItem: IModel;

            if (updateMode !== 'CACHE') updatedItem = (await this.Model.update(documentId, updateData)) as IModel;
            else updatedItem = { ...(await this.Find.byId(documentId)), ...updateData };
            if (updateMode !== 'DB') await this.Cache.save(updatedItem);

            return updatedItem as IModel;
        } catch (error) {
            const payloadJson = JSON.stringify(payload);
            console.log(`${this.errorMsg} update (id: ${documentId}):`, JSON.stringify(payloadJson));
            console.error('Error updating item:', error);
            throw errorsAdapter.Core.createError(errorsAdapter.Core.ErrorsEnum.DATABASE_OPERATION_ERROR, { table: this.Model.name, operation: 'update', documentId, payload: payloadJson });
        }
    }

    Find: IFindMethodsCacheExtended<IModel, TIndexes> = {
        ...this.Find,
        byId: async (id: string, useCache: boolean = true): Promise<IModel> => {
            try {
                if (!id) throw new Error('"id" is required.');
                if (useCache) {
                    const cachedDraft = await this.Cache.get(id);
                    if (cachedDraft) return cachedDraft;
                    console.log(`claim ${id} not readed from cache`);
                }
                return (await this.Model.get(id)) as IModel;
            } catch (error) {
                console.error(`Error find item ${id} (useCache ${useCache}): ${error}`);
                throw errorsAdapter.Core.createError(errorsAdapter.Core.ErrorsEnum.DATABASE_OPERATION_ERROR, { table: this.Model.name, operation: 'Find byId', id });
            }
        },

        byIndex: async (key: TIndexes, value: string, limit: number = 0, useCache: boolean = true) => {
            try {
                if (!value) throw new Error(`Value "${value}" for ${key} is required.`);

                const query = this.Model.query(key).eq(value).using(SchemasGlobal.Index.createIndexName<TIndexes>(key));

                let results = (await (limit > 0 ? this.withLimit(query, limit) : query.all().exec())) as IModel[] | any[];

                if (useCache && results?.length) {
                    results = await Promise.all(
                        results.map(async (result) => {
                            const cachedResult = await this.Cache.get(result.id);
                            if (cachedResult) return cachedResult;
                            return result;
                        })
                    );
                }

                return limit === 1 ? results?.[0] : results;
            } catch (error) {
                console.error(`${this.errorMsg} byKey (key:${key} value: ${value}):`, error);
                throw errorsAdapter.Core.createError(errorsAdapter.Core.ErrorsEnum.DATABASE_OPERATION_ERROR, { table: this.Model.name, operation: 'Find byIndex', key, value });
            }
        },
    };

    syncCacheToDb = async (): Promise<void> => {
        const recordsToSync: (IModel & { id: string })[] = (await this.Cache.getToSyncDB()) as (IModel & { id: string })[];
        if (!recordsToSync || !recordsToSync.length) return;

        await Promise.allSettled(recordsToSync.map(async (record) => await this.update(record.id, record)));
    };
}
