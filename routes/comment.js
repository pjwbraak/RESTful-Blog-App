var express     = require("express"),
    router      = express.Router(),
    Comment     = require("../models/comment"),
    middleware  = require("../middleware");

module.exports = router;