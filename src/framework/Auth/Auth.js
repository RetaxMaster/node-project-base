const passport = require("passport");

class Auth {

    static guard() {
        return new Auth();
    }

    login(req, user) {

        let errors = false;

        req.logIn(user, err => {
            errors = err;
        });

        return errors;
        
    }

    async validateRegisterData(req, res, next) {
        return await new Promise((resolve, reject) => {
            passport.authenticate("local.signup", (err, user) => {
                resolve(err);
            })(req, res, next);
        });
    }

    async attempt(req, res, next) {
        return await new Promise((resolve, reject) => {
            passport.authenticate("local.signin", (err, user) => {

                // Si todo salió bien, inciamos la sesión
                if (!err) err = this.login(req, user);
                resolve(!err); // Si hay errores, err vendrá en true, por lo que resolvemos con falso, para decir que el login attempt no pasó

            })(req, res, next);
        });
    }

    user(req) {
        return req.user;
    }

    logout(req) {
        req.logOut();
    }

}

module.exports = Auth;