const router = require("express").Router()
const { createConversation, getConversation, deleteConversation } = require("../controllers/Conversation")
const verifyToken = require("../Middleware/VerifyToken")

router.use(verifyToken)
router.route("/conversation").post(createConversation)
router.route("/conversation/:userId").get(getConversation)
router.route("/conversation/:convoId").delete(deleteConversation)

module.exports = router