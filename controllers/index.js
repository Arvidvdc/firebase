const   middleware  = require("../middleware/index");

// Default
exports.default = (req,res)=> {
    res.render("./default/landing", {css: "landing.css", page: ""});
}

exports.content = (req,res) => {
    res.render("./default/content", {css: res.locals.css, page: "content"});
}