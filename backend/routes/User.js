const router = require("express").Router()
const { getUser, getUsers, createUser } = require("../controllers/User")

router.route("/login").post(getUser)
router.route("/signup").post(createUser)
router.route("/users/:query").get(getUsers)

module.exports = router;