
const Auth = require("./Auth");

class RegisterUsers {

    // Simulated laravel frameworks methods, don't touch, just override in controller

    static async register(req, res, next) {
    
        const validatorResult = this.validator(req, res).validate();
        if(!validatorResult) return validatorResult;

        // Esta función solo validará si el usuario puede registrarse con los datos que ingresó, si no puede, regresará un array con los errores
        const error = await this.guard().validateRegisterData(req, res, next);

        if (!error) {
            const user = await this.create(req.body);
            this.guard().login(req, user);
            return await this.sendRegisterResponse(req, res, user);
        }

        return this.sendFailedRegisterResponse(req, res, error);

    }

    static async sendRegisterResponse(req, res, user) {

        const registeredFunction = await this.registered(req, res, user);
        return registeredFunction ? registeredFunction : res.redirect(this.redirectPath(req, res));

    }

    static sendFailedRegisterResponse(req, res, error) {

        const jsonError = {error}
        req.flash("errors", [jsonError]);
        return res.redirect("back");

    }

    static redirectPath(req, res) {

        if (typeof this.redirectTo == "function") {
            return this.redirectTo(req, res);
        }

        return this.redirectTo ? this.redirectTo : "/";

    }

    static async registered(req, res, user) { 
        //
    }

    static guard() {
        return Auth.guard();
    }

}

module.exports = RegisterUsers;