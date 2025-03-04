import axios from "axios";
import React, { useEffect, useState } from "react";
import { toaster } from "../ui/toaster";
import { ChatState } from "../../Context/ChatProvider";
import { Box, Stack, Text, Avatar } from "@chakra-ui/react";
import ChatLoading from "./ChatLoading";
import { getSender, getSenderFull } from "../../config/ChatLogic";
import CreateGroupChat from "./CreateGroupChat";
import ProfileBox from "./ProfileBox";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        "http://localhost:3000/api/chat",
        config
      );
      setChats(data);
    } catch (error) {
      toaster.create({
        title: `Error occurred`,
        type: "error",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      bg="gray"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        Chats
        <CreateGroupChat />
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflow="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                key={chat._id}
                onClick={() => {
                  if (selectedChat?._id !== chat._id) {
                    setSelectedChat(chat);
                  }
                }}
                cursor="pointer"
                bg={selectedChat?._id === chat._id ? "black" : "gray"}
                color={selectedChat?._id === chat._id ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
              >
                <Text display="flex" alignItems="center">
                  {!chat.groupChat ? (
                    <>
                      {chat?.users.length > 0 && (
                        <Avatar.Root>
                          <Avatar.Fallback
                            mt="7px"
                            p="2px"
                            sizes="sm"
                            cursor="pointer"
                          />
                          <Avatar.Image
                            src={
                              getSenderFull(loggedUser, chat.users)
                                ?.profilePic || ""
                            }
                          />
                        </Avatar.Root>
                      )}
                      <span style={{ marginLeft: "8px" }}>
                        {chat?.users && getSender(loggedUser, chat.users)}
                      </span>
                    </>
                  ) : (
                    chat.chatName
                  )}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
