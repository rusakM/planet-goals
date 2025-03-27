import { createTransport, TransportOptions, SendMailOptions } from 'nodemailer';
import { accountService } from '.';
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
                service: 'SendGrid',
                auth: {
                    user: ConstantsEnv.Email.SENDGRID_USERNAME,
                    pass: ConstantsEnv.Email.SENDGRID_PASSWORD,
                },
            });
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

    async send(data: string, subject: string) {
        const options: SendMailOptions = {
            from: this.from,
            to: this.to,
            subject,
            text: data,
        };
        await this.newTransport().sendMail(options);
    }

    async sendVerificationCode(verificationCode: string) {
        await this.send(verificationCode, 'Planet Goals - Verification code');
    }
}
