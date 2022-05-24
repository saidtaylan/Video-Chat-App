import {transporter} from "./mailConfig";

export const sendMail = async (from: string, to: string[], subject?: string, html?: string, text?: string) => {
    await transporter.sendMail({
        from,
        to,
        subject: subject ? subject : null,
        text: text ? text : null,
        html: html ? html : null
    });

}