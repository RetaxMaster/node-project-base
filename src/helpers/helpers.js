const bcrypt = require("bcryptjs");
const fs = require("fs");

const helpers = {

    setRequest: (req) => {
        helpers.req = req;
    },

    getBaseURL : () => {
        const { req } = helpers;
        const protocol = req.protocol + '://';
        const host = req.get('host');
        return protocol + host;
    },

    asset : file => {
        return helpers.getBaseURL() + "/" + file;
    },

    env: env_var => {
        return process.env[env_var];
    },

    route: (name, params = null) => {

        const { req } = helpers;

        const allRoutes = req.app._router.names;

        let url = allRoutes[name];

        if (url != undefined && params != null) {
            for (const key in params) {
                const regexp = new RegExp(key + "\\??");
                const value = params[key];
                url = url.replace(regexp, value);
            }
        }

        return url ? helpers.getBaseURL() + url : url;

        /*
        
        Ejemplo de uso:

        <?= route "services-app-id" (params 
            ":id" "algo"
        )?>
        
        */

    },

    params: (...params) => {

        const paramsJSON = {};

        for (let i = 0; i < params.length; i+= 2) {
            const item = params[i];
            paramsJSON[item] = params[i+1];
        }

        return paramsJSON;

    },

    encryptPassword: async (password) => {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    },
      
    matchPassword: async (password, savedPassword) => {
        try {
            return await bcrypt.compare(password, savedPassword);
        } catch (e) {
            console.log(e);
        }
    },

    readdir: (directoryPath, callback, callbackEachFile = true) => {

        fs.readdir(directoryPath, function (err, files) {

            //handling error
            if (err) return console.log('Unable to scan directory: ' + err);

            if (callbackEachFile) {
                files.forEach(function (file) {
                    callback(file, files);
                });
            }
            else {
                callback(files);
            }

        });

    },

    getErrorsArray: (errors) => {

        const array = [];
        const allErrors = errors[0];

        for (const key in allErrors) {
            const error = allErrors[key];
            error.forEach(message => {
                array.push(message);
            });
        }

        return array;

    }

};

module.exports = helpers;