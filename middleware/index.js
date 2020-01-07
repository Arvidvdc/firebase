const   User            = require("../models/user"),
        middlewareObj   = {};

middlewareObj.isLoggedIn = (req,res,next) => {
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash("error", "Hiervoor is inloggen verplicht.");
        res.redirect("/users/login");
    };
};

middlewareObj.isActive = (req,res,next) => {
    if(req.isAuthenticated()) {
        let testUser= req.user.isActive;
        if(testUser) {
            return next();
        } else {
            req.flash("error", "Uw account is nog niet geactiveerd.");
            res.redirect("/");
        }
    } else {
        req.flash("error", "Hiervoor is inloggen verplicht.");
        res.redirect("/users/login");
    }
}

middlewareObj.isOperator = (req,res,next) => {
    if(req.isAuthenticated()) {
        let testUser= req.user.role;
        let regex = RegExp('operator');
        if(regex.test(testUser)) {
            return next();
        } else {
            console.log("middlewareObj.isOperator: Ingelogde gebruiker heeft geen rechten.");
            res.redirect("back");
        }
    } else {
        console.log("middlewareObj.isOperator: Niet ingelogd.");
        res.redirect("/users/login");
    }
}

module.exports = middlewareObj;