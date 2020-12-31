const helpers = require("../../helpers/helpers");

class Guest {

    /** Tiene que retornar next() o res.redirect() */
    async handle(req, res, next) {

        if (!req.user)
            return next();

        return res.redirect(helpers.route("profile", {
            ":section": "library"
        }));

    }

}

module.exports = Guest;