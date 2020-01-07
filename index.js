// Require dependencies
const   express             = require("express"),
        app                 = express(),
        User                = require("./models/user"),
        bodyParser          = require("body-parser"),
        flash               = require("connect-flash"),
        mongoose            = require("mongoose"),
        passport            = require("passport"),
        LocalStrategy       = require("passport-local"),
        methodOverride      = require("method-override"),
        indexRoutes         = require("./routes/index"),
        usersRoutes         = require("./routes/users");

// dotENV
require('dotenv').config();

// Passport Configuration
app.use(require("express-session")({
secret: "Beard-Squad Development",
resave: false,
saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Express variables
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(require("express-session")({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// Database connection
mongoose.connect(process.env.DB_URL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false}).then(
        () => {
          console.log('Database is connected') },
        err => { console.log('Can not connect to the database'+ err)}
    );

app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Routes
app.use(indexRoutes);
app.use("/users", usersRoutes);

// Listener
app.listen(process.env.APP_PORT, process.env.APP_IP, ()=>console.log("SeriesTool started on " + process.env.APP_IP + " port " + process.env.APP_PORT));