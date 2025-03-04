const express = require("express");
const { sendMessage, allMessage } = require("../controllers/messageControllers"); // ✅ Ensure correct path
const { protect } = require("../middleware/authMiddileware"); // ✅ Ensure correct path

const router = express.Router();
router.post("/", protect, sendMessage);
console.log(sendMessage)  // ✅ Check if `sendMessage` is defined
router.get("/:chatId", protect, allMessage);
console.log(allMessage)  // ✅ Check if `allMessage` is defined
module.exports = router;
