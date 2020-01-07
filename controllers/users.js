const   passport    = require("passport"),
        User        = require("../models/user");

// Register controlers
exports.register = (req,res)=> {
    res.render("./users/register", {css: "landing.css"});
}

exports.register_post = (req,res) => {
    let newUser = new User({username: req.body.username,email: req.body.email, role: 'user', isActive: false});
    User.register(newUser, req.body.password , (err, user)=>{
        if(err) {
            console.log(err)
            req.flash("error", err.message); 
            res.redirect("./register");
        }
        passport.authenticate("local")(req,res, function(){
            req.flash("success", "Welkom " + user.username + ". Wacht tot je account akkoord is.");
            res.redirect("/content");
        });
    });
}

// Login controllers
exports.login = (req,res) => {
    res.render("./users/login", {css: "landing.css"});
}

exports.login_post =  passport.authenticate("local", {
    successRedirect: "/content", 
    failureRedirect: "/users/login",
    failureFlash: true
}), (req,res)=> {
       
}

// Logout controller
exports.logout = (req,res) => {
    req.logout();
    req.flash("success", "Je bent uitgelogd.");
    res.redirect("/");
}