const express = require("express")
const router = express.Router()
const userController = require("../controllers/user")

router.get("/", userController.getHome)
router.get("/locator", userController.getLocator)
router.get("/user", userController.getUser)
router.get("/contact", userController.getContact)

router.post("/search", userController.postSearch)

module.exports = router;

