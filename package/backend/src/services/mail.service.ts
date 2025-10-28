import { createTransport, TransportOptions, SendMailOptions } from 'nodemailer';
import { accountService, templateService } from '.';
import { ConstantsEnv } from '../core/constants';

export class Email {
    protected to: string;
    protected firstName: string;
    protected from = `Planet Goals <${ConstantsEnv.Email.EMAIL_FROM}>`;
    constructor(user: accountService.Model.IAccount) {
        this.to = user.email;
        this.firstName = user.firstName;
    }

    newTransport() {
        if (ConstantsEnv.Main.APP_MODE !== ConstantsEnv.APP_MODES.DEV) {
            return createTransport({
                host: ConstantsEnv.Email.BREVO_ADDRESS,
                port: ConstantsEnv.Email.BREVO_PORT,
                auth: {
                    user: ConstantsEnv.Email.BREVO_USERNAME,
                    pass: ConstantsEnv.Email.BREVO_PASSWORD,
                },
            } as TransportOptions);
        }
        return createTransport({
            host: ConstantsEnv.Email.EMAIL_HOST,
            port: ConstantsEnv.Email.EMAIL_PORT,
            auth: {
                user: ConstantsEnv.Email.EMAIL_USERNAME,
                pass: ConstantsEnv.Email.EMAIL_PASSWORD,
            },
        } as TransportOptions);
    }

    async send(htmlData: string, subject: string) {
        const options: SendMailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html: htmlData
        };
        await this.newTransport().sendMail(options);
    }

    async sendVerificationCode(verificationCode: string) {
        const template = await templateService.Login.renderLogin('en', verificationCode);
        await this.send(template, 'Your PlanetGoals login code');
    }
}
