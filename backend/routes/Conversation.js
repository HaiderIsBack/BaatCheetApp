const router = require("express").Router()
const { createConversation, getConversation, deleteConversation } = require("../controllers/Conversation")

router.route("/conversation").post(createConversation)
router.route("/conversation/:userId").get(getConversation).delete(deleteConversation)

module.exports = router