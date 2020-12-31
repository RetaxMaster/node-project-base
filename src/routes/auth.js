const express = require('express');
const namedRoutes = require("../framework/ExpressNamedRoutes/namedRoutes");
const expressRouter = express.Router();
const router = namedRoutes.getRouter(expressRouter);
const mw = require("../app/middlewares/Kernel");

// Shorthands para ciertos middlewares comunes
const authMW = mw(["auth"]);
const guestMW = mw(["guest"]);

// Controladores

const LoginController  = require('../app/controllers/auth/LoginController');
const RegisterController  = require('../app/controllers/auth/RegisterController');
const ForgotPasswordController  = require('../app/controllers/auth/ForgotPasswordController');
const ResetPasswordController  = require('../app/controllers/auth/ResetPasswordController');

// Enrutador

router.get("/login", guestMW, LoginController.showLoginForm).setName("login");

router.get("/register/", guestMW, RegisterController.showRegistrationForm).setName("register");

router.post("/logout", authMW, async (req, res) => {
    await LoginController.logout(req, res)
}).setName("logout");

router.post("/auth", guestMW, async (req, res) => {
    if (req.body.mode == "login") 
        await LoginController.login(req, res);
    else
        await RegisterController.register(req, res);
}).setName("auth");

router.get("/password/reset", guestMW, ForgotPasswordController.showLinkRequestForm).setName("passwordRequest");

router.post("/password/email", guestMW, async (req, res) => {
    await ForgotPasswordController.sendResetLinkEmail(req, res);
}).setName("passwordEmail");

router.get("/password/reset/:token", guestMW, ResetPasswordController.showResetForm).setName("passwordReset");

router.post("/password/reset", guestMW, async (req, res) => {
    await ResetPasswordController.reset(req, res);
}).setName("passwordUpdate");



module.exports = router;