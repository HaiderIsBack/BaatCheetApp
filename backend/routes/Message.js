const router = require("express").Router()
const {createMessage,getMessage} = require("../controllers/Message")

router.route("/message").post(createMessage)
router.route("/message/:conversationId").get(getMessage)

module.exports = router