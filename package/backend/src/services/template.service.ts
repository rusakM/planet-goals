import ejs from 'ejs';
import path from 'node:path';

const baseLocation = `${process.cwd()}/src/views`;

async function renderTemplate(templateName: string, props?: unknown): Promise<string> {
    try {
        const fileLocation = path.join(baseLocation, `${templateName}.ejs`);
        return await ejs.renderFile(fileLocation, props);
    } catch (error) {
        console.log(error);
        return "";
    }
};

export namespace Register {
    export async function renderRegister(locale: string, verificationCode: string) {
        return (await renderTemplate(`emails/register/${locale}`, { verificationCode })) || verificationCode;
    }
}

export namespace Login {
    export async function renderLogin(locale: string, verificationCode: string) {
        return (await renderTemplate(`emails/login/${locale}`, { verificationCode })) || verificationCode;
    }
}