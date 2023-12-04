const router = require("express").Router()
const { getUser, getUsers, createUser, updateUser } = require("../controllers/User")
const verifyToken = require("../Middleware/VerifyToken")

router.route("/login").post(getUser)
router.route("/signup").post(createUser)
router.use(verifyToken)
router.route("/users/:query").get(getUsers)
router.route("/user").put(updateUser)

module.exports = router;