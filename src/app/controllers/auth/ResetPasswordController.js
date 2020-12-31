const ResetPasswords = require("../../../framework/Auth/ResetPasswords");

class ResetPasswordController extends ResetPasswords {

    static showResetForm(req, res) {

        return res.render("auth/reset");

    }

}

module.exports = ResetPasswordController;