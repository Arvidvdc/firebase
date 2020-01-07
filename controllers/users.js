const   passport    = require("passport"),
        User        = require("../models/user")
        async       = require("async"),
        nodemailer  = require("nodemailer"),
        crypto      = require("crypto");

// Register controlers
exports.register = (req,res)=> {
    res.render("./users/register", {css: "landing.css"});
}

exports.register_post = (req,res) => {
    let newUser = new User({username: req.body.username,email: req.body.email, role: "user", isActive: false});
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

// Forgot controller
exports.forot = (req,res) => {
    res.render("./users/forgot", {css: "landing.css"});
}

exports.forot_post = (req, res, next) => {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString("hex");
                done(err, token);
            });
        },
        function (token, done) {
            User.findOne({ email: req.body.email }, function (err, user) {
                if (!user) {
                    req.flash("error", "Email niet gevonden.");
                    return res.redirect("/users/forgot");
                }
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function (err) {
                    done(err, token, user);
                });
            });
        },
        function (token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: process.env.GMAILUSR,
                    pass: process.env.GMAILPW
                }
            });
            var mailOptions = {
                to: user.email,
                from: "Firebase <" + process.env.GMAILUSR + ">",
                subject: "Wachtwoord reset.",
                text: "Je ontvangt dit bericht omdat er een wachtwoord wijziging aangevraagd is voor je account.\n\n" +
                    "Klik op de volgende link, of copy/paste deze link in je browser om het proces te voltooien:\n\n" +
                    "http://" + req.headers.host + "/users/reset/" + token + "\n\n" +
                    "Als je niet om deze wijziging gevraagd hebt, hoef je niets te doen. Je wachtwoord zal niet veranderen.\n"
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                console.log("mail sent");
                req.flash("success", "Een e-mail is gestuurd naar " + user.email + " met verdere instructies.");
                done(err, "done");
            });
        }
    ], function (err) {
        if (err) return next(err);
        res.redirect("/");
    });
}

// Reset controller
exports.reset = (req, res) => {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        if (!user) {
            req.flash("error", "Wachtwoord wijzigen is verlopen of niet geldig.");
            return res.redirect("/users/forgot");
        }
        res.render("./users/reset", { token: req.params.token, css: "landing.css" });
    });
}

exports.reset_post = (req, res) => {
    async.waterfall([
        function (done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
                if (!user) {
                    req.flash("error", "Wachtwoord wijzigen is verlopen of niet geldig.");
                    return res.redirect("back");
                }
                if (req.body.password === req.body.confirm) {
                    user.setPassword(req.body.password, function (err) {
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;

                        user.save(function (err) {
                            req.logIn(user, function (err) {
                                done(err, user);
                            });
                        });
                    })
                } else {
                    req.flash("error", "Wachtwoorden komen niet overeen.");
                    return res.redirect("back");
                }
            });
        },
        function (user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: process.env.GMAILUSR,
                    pass: process.env.GMAILPW
                }
            });
            var mailOptions = {
                to: user.email,
                from: "Firebase <" + process.env.GMAILUSR + ">",
                subject: "Je wachtwoord is gewijzigd",
                text: "Hello,\n\n" +
                    "Dit is de bevestiging dat je wachtwoord voor " + user.email + " is gewijzigd.\n"
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                req.flash("success", "Succes! je wachtwoord is gewijzigd.");
                done(err);
            });
        }
    ], function (err) {
        res.redirect("/content");
    });
}