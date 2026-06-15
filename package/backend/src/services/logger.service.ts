type TLogInput = string | number | boolean | Object | Array<string | number | boolean | Object>;

export class Logger {
    private service: string;

    constructor(service: string) {
        this.service = service;
    }

    private getLogInfo() {
        return `${new Date().toISOString()} - ${this.service} - `;
    }

    public silly(log: TLogInput, data?: unknown) {
        console.log(`${this.getLogInfo()}${log}`, data);
    }

    public error(log: TLogInput, data?: unknown) {
        console.error(`${this.getLogInfo()}${log}`, data);
    }

    public info(log: TLogInput, data?: unknown) {
        console.info(`${this.getLogInfo()}${log}`, data);
    }

    public warn(log: TLogInput, data?: unknown) {
        console.warn(`${this.getLogInfo()}${log}`, data);
    }
}
