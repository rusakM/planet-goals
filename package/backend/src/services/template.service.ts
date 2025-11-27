import ejs from 'ejs';
import path from 'node:path';

type TRenderedTemplate = [html: string, text: string];
const baseLocation = `${process.cwd()}/src/views`;

async function renderTemplate(templateName: string, props?: unknown): Promise<string> {
    try {
        const fileLocation = path.join(baseLocation, `${templateName}.ejs`);
        return await ejs.renderFile(fileLocation, props);
    } catch (error) {
        console.log(error);
        return '';
    }
}

export namespace Register {
    export async function renderRegister(locale: string, verificationCode: string): Promise<TRenderedTemplate> {
        return (await Promise.all([renderTemplate(`emails/register/${locale}`, { verificationCode }), renderTemplate(`emails/register/${locale}.text`, { verificationCode })])) || [verificationCode, verificationCode];
    }
}

export namespace Login {
    export async function renderLogin(locale: string, verificationCode: string): Promise<TRenderedTemplate> {
        return (await Promise.all([renderTemplate(`emails/login/${locale}`, { verificationCode }), renderTemplate(`emails/login/${locale}.text`, { verificationCode })])) || [verificationCode, verificationCode];
    }
}
