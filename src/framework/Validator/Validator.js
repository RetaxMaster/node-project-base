const ValidatorJS = require('validatorjs');

class Validator extends ValidatorJS {

    constructor(req, res, data, rules, customMessages = null) {
        super(data, rules, customMessages);
        this.res = res;
        this.req = req;
    }

    static make(req, res, data, rules, customMessages = null) {
        return new Validator(req, res, data, rules, customMessages);
    }

    validate() {
        if (this.fails()) {
            this.req.flash("errors", this.errors.all());
            return this.res.redirect("back");
        }
        return true;
    }

}

// Custom validation rules
Validator.register("timestamp", (value, requirement, attribute) => {
    return value.match(/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])( (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9])?$/);
}, 'The :attribute is not in the format yyyy-mm-dd hh:mm:ss.');

module.exports = Validator;