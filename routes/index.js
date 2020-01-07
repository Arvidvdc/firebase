const   express             = require("express"),
        router              = express.Router(),
        index_controller    = require("../controllers/index"),
        middleware          = require("../middleware/index");

// Default route
router.get("/", index_controller.default);

// Content route
router.get("/content", middleware.isActive, index_controller.content);

// Export router
module.exports = router;