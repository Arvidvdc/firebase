// Default
exports.default = (req,res)=> {
    res.render("./default/landing", {css: "landing.css"});
}

exports.content = (req,res) => {
    res.render("./default/content");
}