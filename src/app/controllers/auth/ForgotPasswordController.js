const SendPasswordResetEmails = require("../../../framework/Auth/SendPasswordResetEmails");

class ForgotPasswordController extends SendPasswordResetEmails {

    static showLinkRequestForm(req, res) {
        return res.render("auth/email");
    }

}

module.exports = ForgotPasswordController;