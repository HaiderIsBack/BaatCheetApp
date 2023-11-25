const router = require("express").Router()
const { getUser, getUsers, createUser, updateUser } = require("../controllers/User")

router.route("/login").post(getUser)
router.route("/signup").post(createUser)
router.route("/users/:query").get(getUsers)
router.route("/user").patch(updateUser)

module.exports = router;