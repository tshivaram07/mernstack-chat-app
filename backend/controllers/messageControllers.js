const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        return res.status(400).json({ error: "Invalid data" });
    }

    try {
        let newMessage = {
            sender: req.user._id,
            content,
            chat: chatId,
        };

        let message = await Message.create(newMessage);
        message = await message.populate("sender", "name profilePic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name profilePic email",
        });

        await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

        res.json(message);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const allMessage = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({chat:req.params.chatId} )
            .populate("sender", "name profilePic email")
            .populate("chat");

        res.json(messages);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ✅ Ensure the functions are exported properly
module.exports = { sendMessage, allMessage };
