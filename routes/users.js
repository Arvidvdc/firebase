// Require dependencies
const   express             = require("express"), 
        router              = express.Router(),
        users_controller    = require("../controllers/users"),
        middleware          = require("../middleware/index");

// Register route
router.get("/register", users_controller.register);

router.post("/register", users_controller.register_post);

// Login routes
router.get("/login", users_controller.login);

router.post("/login", users_controller.login_post);

// Logout route
router.get("/logout", users_controller.logout);

// Forgot routes
router.get("/forgot", users_controller.forot);

router.post("/forgot", users_controller.forot_post);

// Reset routes
router.get("/reset/:token", users_controller.reset);

router.post("/reset/:token", users_controller.reset_post);

// Export router
module.exports = router;