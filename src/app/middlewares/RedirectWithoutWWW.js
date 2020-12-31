
module.exports = () => {

    return async (req, res, next) => {

        if (process.env.APP_ENV == "production" && req.subdomains.length > 0)
            return res.redirect("https://", 301);

        next();
        
    }

}