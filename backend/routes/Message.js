const router = require("express").Router()
const {createMessage,getMessage} = require("../controllers/Message")
const verifyToken = require("../Middleware/VerifyToken")

router.use(verifyToken)
router.route("/message").post(createMessage).get(getMessage)
router.route("/message/:conversationId").get(getMessage)

module.exports = router