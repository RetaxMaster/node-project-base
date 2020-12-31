const Mail = require("../Mail/Mail")
const Validator = require("../Validator/Validator");
const { User } = require("../../app/models");
const helpers = require("../../helpers/helpers");

class SendPasswordResetEmails {

    static async sendResetLinkEmail(req, res) {

        const validatorResult = this.validateEmail(req, res);
        if(!validatorResult) return validatorResult;

        // Ahora enviamos el email
        const response = await this.sendResetLink(
            this.credentials(req)
        );

        return response.status 
                ? this.sendResetLinkResponse(req, res, response)
                : this.sendResetLinkFailedResponse(req, res, response);


    }

    static validateEmail(req, res) {
         return Validator.make(req, res, req.body, { email: "required|email" }).validate();
    }

    static async sendResetLink(credentials) {

        let response = {};

        // Primero verifico que el correo exista
        const user = await User.findOne({
            where: {
                email: credentials
            }
        });

        if (user) {

            // Establezco el token que será pasado a la URL para recuperar la contraseña TODO: Faltaría agregar un cron que haga que expire en 10 minutos
            const recover_token_without_encrypt = helpers.getRandomString(10);
            const recover_token = await helpers.encryptPassword(recover_token_without_encrypt);

            response = await Mail.send(credentials, "Recuperación de contraseña", "basic_text_email", {
                title: "Recuperación de contraseña",
                text: "Hemos recibido una solicitud de cambio de contraseña para tu cuenta, puedes cambiar tu contraseña dando click dando al botón, no compartas este enlace con nadie. Si tu no solicitaste ningún cambio de contraseña para tu cuenta no es necesario que hagas ninguna acción.",
                button: {
                  text: "Cambiar contraseña",
                  href: helpers.route("passwordReset", {
                      ":token": recover_token_without_encrypt
                  })
                }
            });

            if (response.status) {
                user.password_recover_token = recover_token;
                user.save();
            }
            
        }
        else {
            response.status = false;
            response.message = "Este correo no existe";
        }

        return response;

    }

    static credentials(req) {
        return req.body.email;
    }

    static sendResetLinkResponse(req, res, response) {
        req.flash("success_mailing", response.message);
        return res.redirect("back");
    }

    static sendResetLinkFailedResponse(req, res, response) {
        req.flash("error_mailing", response.message);
        return res.redirect("back");
    }

}

module.exports = SendPasswordResetEmails;