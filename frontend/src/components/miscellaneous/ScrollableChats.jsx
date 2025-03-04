import React, { useEffect, useRef } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender } from "../../config/ChatLogic";
import { ChatState } from "../../Context/ChatProvider";
import { Box, Avatar } from "@chakra-ui/react";
import { Tooltip } from "../ui/tooltip";
import { motion } from "framer-motion"; // ✅ Import Framer Motion

const ScrollableChats = ({ messages }) => {
  const { user } = ChatState() || {}; // Ensure user is always an object
  const lastMessageRef = useRef(null); // Reference for scrolling

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // Scrolls when messages change

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => {
          const isSender = m.sender?._id === user?._id; // Safe check for sender ID
          const showAvatar =
            isSameSender(messages, m, i, user?._id) ||
            isLastMessage(messages, i, user?._id);

          return (
            <motion.div
              key={m._id}
              ref={i === messages.length - 1 ? lastMessageRef : null} // Attach ref to the last message
              initial={{ opacity: 0, y: 10 }} // ✅ Initial animation (fade-in + slide-up)
              animate={{ opacity: 1, y: 0 }} // ✅ Animation when appearing
              exit={{ opacity: 0, y: -10 }} // ✅ Optional: Fade-out when removed
              transition={{ duration: 0.3 }} // ✅ Smooth transition
            >
              <Box
                display="flex"
                alignItems="center"
                flexDirection={isSender ? "row-reverse" : "row"} // Sender on Right, Receiver on Left
                mb={2}
                alignSelf={isSender ? "flex-end" : "flex-start"} // Align right for sender
              >
                {/* ✅ Avatar logic */}
                {showAvatar && m.sender && (
                  <Tooltip
                    label={m.sender.name}
                    placement="bottom-start"
                    hasArrow
                  >
                    <Avatar.Root>
                      <Avatar.Fallback
                        mt="7px"
                        mr={isSender ? 0 : 2} // Margin on left for sender, right for receiver
                        ml={isSender ? 2 : 0}
                        sizes="sm"
                        cursor="pointer"
                        name={m.sender.name}
                      />
                      <Avatar.Image src={m.sender.profilePic} />
                    </Avatar.Root>
                  </Tooltip>
                )}

                {/* ✅ Message box with animation */}
                <Box
                  bg={isSender ? "blue.100" : "gray.200"} // Different background colors
                  padding="5px 15px"
                  borderRadius="lg"
                  maxWidth="75%"
                  wordBreak="break-word"
                  borderBottomRightRadius={isSender ? "0" : "lg"}
                  borderBottomLeftRadius={isSender ? "lg" : "0"}
                  ml={!isSender && !showAvatar ? "45px" : "6px"} // Shift receiver message only if no avatar
                >
                  {m.content}
                </Box>
              </Box>
            </motion.div>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChats;
