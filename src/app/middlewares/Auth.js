const helpers = require("../../helpers/helpers");

class Auth {

    /** Tiene que retornar next() o res.redirect() */
    async handle(req, res, next) {

        if (req.user)
            return next();

        return res.redirect(helpers.route("login"));

    }

}

module.exports = Auth;