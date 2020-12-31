const { route } = require("../../helpers/helpers");

class ViewsController {

    static loadHome (req, res) {
        res.render("home");
    }

    static loadProfile (req, res) {
        res.render("profile");
    }

}

module.exports = ViewsController;