const helpers = require("../../helpers/helpers");

module.exports = (app) => {

    return (req, res, next) => {

        helpers.setRequest(req)

        app.locals.req = req;
        app.locals.errors = req.flash("errors");
        app.locals.user = req.user;

        // Añado cada función a locals para que puedan usar usadas como helpers
        for (const key in helpers)
            app.locals[key] = helpers[key];

        next();
    }

}