const Validator = require("../../../framework/Validator/Validator");
const RegisterUsers = require("../../../framework/Auth/RegisterUsers");
const { route } = require("../../../helpers/helpers");
const { User } = require("../../models");
const helpers = require("../../../helpers/helpers");

class RegisterController extends RegisterUsers {

    static validator(req, res) {
        return Validator.make(req, res, req.body, {
            //Validation rules
            name: "required|string|max:50",
            lastName: "required|string|max:50",
            email: "required|email|max:255",
            password: "required|string|confirmed",
            birthDate: "required|string|timestamp"
        });
    }

    static async create(data) {

        // Aquí se hace el registro
        return await User.create({
            first_name: data.name,
            last_name: data.lastName,
            email: data.email,
            password: await helpers.encryptPassword(data.password),
            birth_date: data.birthDate,
            pay_day: helpers.getCurrentDay()
        });
        

    }

    static redirectTo(req, res) {

        const { back_url } = req.body;

        // Si redirect_link viene definido es porque viene desde algún lugar al que hay que volver
        const redirect_link = back_url ? back_url : route("profile");

        return redirect_link;
    }

    static showRegistrationForm (req, res) {

        let { become } = req.params;

        const formClass = "register";
        const textMode = "Regístrate";
        res.render("auth/auth", {
            formClass,
            textMode
        });

    }

}



module.exports = RegisterController;