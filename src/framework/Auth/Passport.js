const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const helpers = require("../../helpers/helpers");
const { User } = require("../../app/models");

passport.use("local.signup", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, async (req, username, password, done) => {

    const errors = [];

    const user = await User.findOne({
        where: {
            email: username
        }
    });

    if (user) errors.push("El email ya está registrado");

    if(errors.length > 0)
        done(errors, false);

    done(null, false);

}));

passport.use("local.signin", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, async (req, username, password, done) => {

    const user = await User.findOne({
        where: {
            email: username
        }
    });

    if (user) {
        const canLogin = await helpers.matchPassword(password, user.password);
        const userToReturn = canLogin ? user : null;
        done(!canLogin, userToReturn); // El primer parámetro son los errores, por lo que si canLogin es verdadero, paso los errores como falsos
    }
    else {
        done(true, false);
    }

}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findByPk(id);
    done(null, user);
});