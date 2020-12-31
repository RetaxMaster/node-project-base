const AuthenticateUsers = require("../../../framework/Auth/AuthenticatesUsers");
const Validator = require("../../../framework/Validator/Validator");
const { route } = require("../../../helpers/helpers");

class LoginController extends AuthenticateUsers {

    static validator(req, res) {

        const validationRules = {
            password: "required|string"
        }

        validationRules[this.username()] = "required|email";

        return Validator.make(req, res, req.body, validationRules);
    }

    static redirectTo(req, res) {

        // Si redirect_link viene definido es porque viene desde algún lugar al que hay que volver
        const redirect_link = route("profile");

        return redirect_link;

    }

    static showLoginForm (req, res) {

        const formClass = "login";
        const textMode = "Iniciar sesión";
        res.render("auth/auth", {
            formClass,
            textMode,
            become: "false"
        });

    }

}

module.exports = LoginController;