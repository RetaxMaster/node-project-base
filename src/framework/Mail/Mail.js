const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require('path');
const helpers = require("../../helpers/helpers");

class Mail {

    static setApp(app) {
        this.app = app;
    }

    static transporter() {
        return nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: parseInt(process.env.MAIL_PORT),
            secure: parseInt(process.env.MAIL_PORT) === 465,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            }
        });
    }

    static async getTemplate(template, userVars) {
        const file = path.join(this.app.get("views"), `/mails/${template}.ejs`)
        const vars = helpers;
        Object.assign(vars, userVars);
        return await ejs.renderFile(file, vars);
    }

    static async send(email, subject, messageOrTemplate, vars = {}, renderFromTemplate = true) {

        try {

            const params = {
                from: process.env.MAIL_FROM_NAME + `<${process.env.MAIL_FROM_ADDRESS}>`,
                to: email,
                subject,
                html: renderFromTemplate ? await this.getTemplate(messageOrTemplate, vars) : messageOrTemplate
            }

            // Enviamos el mensaje
            const info = await this.transporter().sendMail(params);

            return {
                status: true,
                message: "Email enviado correctamente"
            };

        } catch (error) {

            console.error("ERROR: ", error);

            return {
                status: false,
                message: error.message
            };
            
        }

    }

}

module.exports = Mail;