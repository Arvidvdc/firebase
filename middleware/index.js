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

middlewareObj.css = (req,res,next) => {
    let userName=req.user.username.toUpperCase();
    if(userName==="THIRZA") {
        res.locals.css="thirza.css";
    } else if(userName==="LISANNE") {
        res.locals.css="lisanne.css";
    } else if(userName==="SARGE") {
        res.locals.css="sarge.css";
    } else {
        res.locals.css="main.css";
    }
    next()
}
module.exports = middlewareObj;