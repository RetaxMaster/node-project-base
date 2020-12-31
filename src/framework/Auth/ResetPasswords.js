
const Validator = require("../Validator/Validator");
const helpers = require("../../helpers/helpers");
const { User } = require("../../app/models");
const Auth = require("./Auth");

class ResetPasswords {

    static async reset(req, res) {

        const validatorResult = this.validate(req, res, this.rules(), this.validationErrorMessages());
        if(!validatorResult) return validatorResult;

        const response = await this.resetPassword(req, res, req.body);

        return response.status 
                ? this.sendResetLinkResponse(req, res, response)
                : this.sendResetLinkFailedResponse(req, res, response);

    }

    static validate(req, res, rules, customMessages) {
         return Validator.make(req, res, req.body, rules, customMessages).validate();
    }

    static rules() {
        return {
            "token": "required",
            "email": "required|email",
            "password": "required|confirmed"
        }
    }

    static validationErrorMessages() {
        return null;
    }

    static async resetPassword(req, res, credentials) {

        const { email, password, token } = credentials;
        const response = {};

        // Primero reviso si el email dado tiene un token de cambio de contraseña y es el token correcto
        const user = await User.findOne({
            where: { email }
        });

        if (user.password_recover_token && await helpers.matchPassword(token, user.password_recover_token)) {
            
            // Procedemos a cambiar la contraseña
            user.password = await helpers.encryptPassword(password);
            user.save();

            // Y lo logueamos
            this.guard().login(req, user);
            
            response.status = true;

        }
        else {
            response.status = false;
            response.message = "El token de restablecimiento de contraseña es inválido";
        }
        
        return response;

    }

    static sendResetLinkResponse(req, res) {
        return res.redirect(helpers.route("profile", {
            ":section": "library"
        }));
    }

    static sendResetLinkFailedResponse(req, res, response) {
        req.flash("error", response.message);
        return res.redirect("back");
    }

    static guard() {
        return Auth.guard();
    }

}

module.exports = ResetPasswords;