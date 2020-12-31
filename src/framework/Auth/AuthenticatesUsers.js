
const Auth = require("./Auth");

class AuthenticatesUsers {

    // Simulated laravel frameworks methods, don't touch, just override in controller

    static async login(req, res, next) {

        const validatorResult = this.validator(req, res).validate();
        if(!validatorResult) return validatorResult;

        if (await this.attemptLogin(req, res, next)) {
            return await this.sendLoginResponse(req, res);
        }

        return this.sendFailedLoginResponse(req, res);

    }

    static async attemptLogin(req, res, next) {

        return await this.guard().attempt(req, res, next); // Aquí iria el remember password

    }

    static async sendLoginResponse(req, res) {

        const authenticated = await this.authenticated(req, res, this.guard().user(req));
        return authenticated ? authenticated : res.redirect(this.redirectPath(req, res));

    }

    static sendFailedLoginResponse(req, res) {

        const jsonError = {};
        jsonError[this.username()] = ["Credenciales incorrectas"]

        req.flash("errors", [jsonError]);
        return res.redirect("back");

    }

    static username() {
        return "email";
    }

    static credentials(data) {
        
        const only = {
            password: data.password
        }

        only[this.username()] = data[this.username()];

        return only;

    }

    static async authenticated(req, res, user) { 
        //
    }

    static async loggedOut(req, res) { 
        //
    }

    static redirectPath(req, res) {

        if (typeof this.redirectTo == "function") {
            return this.redirectTo(req, res);
        }

        return this.redirectTo ? this.redirectTo : "/";

    }

    static async logout(req, res) {

        this.guard().logout(req);

        const loggedOut = await this.loggedOut(req, res);
        return loggedOut ? loggedOut : res.redirect("/");

    }

    static guard() {
        return Auth.guard();
    }

}

module.exports = AuthenticatesUsers;