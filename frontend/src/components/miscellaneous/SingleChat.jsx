import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { Box, Button, Input, Spinner, Text } from "@chakra-ui/react";
import { FaArrowLeft } from "react-icons/fa";
import { getSender, getSenderFull } from "../../config/ChatLogic";
import ProfileBox from "./ProfileBox";
import UpdatedChatModal from "./UpdateChatModal";
import axios from "axios";
import { Toaster, toaster } from "../ui/toaster";
import './styles.css'
import ScrollableChats from "./ScrollableChats";
import io from "socket.io-client"
const ENDPOINT="http://localhost:3000";
var socket, selectedChatCompare;
const SingleChat = ({ fetchAgain, setfetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setnotification } =
    ChatState();
  const [messages, setmessages] = useState([]);
  const [loading, setloading] = useState(false);
  const [newMessage, setnewMessage] = useState("");
  const [socketconnected, setsocketconnected] = useState(false)

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      setloading(true);
      const { data } = await axios.get(
        `http://localhost:3000/api/message/${selectedChat._id}`,
        config
      );
      console.log(messages)
      setmessages(data);
      setloading(false);
      socket.emit('join chat', selectedChat._id)
    } catch (error) {
      toaster.create({
        title: `Error occurred`,
        type: "error",
      });
      setloading(false);
    }
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connection", () => setsocketconnected(true));
  }, []);
  useEffect(() => {
    fetchMessages();
    selectedChatCompare=selectedChat;
  }, [selectedChat]);
  console.log(notification , "-----")
  useEffect(() => {
    socket.on("message recieved",(newMessageRecieved)=>{
      if(!selectedChatCompare || selectedChatCompare._id!== newMessageRecieved.chat._id){
        // giv notification
        if(!notification.includes(newMessageRecieved)){
          setnotification([newMessageRecieved,...notification]);
          setfetchAgain(!fetchAgain);
        }
      }else{
        setmessages([...messages,newMessageRecieved]);
      }
    });
  })
  

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setnewMessage("");
        const { data } = await axios.post(
          "http://localhost:3000/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message",data);

        setmessages([...messages, data]);
      } catch (error) {
        toaster.create({
          title: `Error occurred`,
          type: "error",
        });
      }
    }
  };
  const sendMessage1 = async (event) => {
      try {
        const config = {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setnewMessage("");
        const { data } = await axios.post(
          "http://localhost:3000/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message",data);

        setmessages([...messages, data]);
      } catch (error) {
        toaster.create({
          title: `Error occurred`,
          type: "error",
        });
      }
    };


  
  const typingHandler = (e) => {
    setnewMessage(e.target.value);
  };

  return (
    <Box display="flex" flexDirection="column" h="100%" w="100%">
      {!selectedChat ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3}>
            Select a user or group to start chatting
          </Text>
        </Box>
      ) : (
        <>
          {/* Header Section */}
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Button
              variant="ghost"
              display={{ base: "flex", md: "none" }}
              onClick={() => setSelectedChat(null)}
            >
              <FaArrowLeft size={20} />
            </Button>

            {!selectedChat.groupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileBox user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdatedChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setfetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>

          {/* Messages Container (Scrollable) */}
          <Box
            flexGrow={1}
            p={3}
            bg="white"
            w="100%"
            borderRadius="lg"
            overflowY="auto"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div>
                <ScrollableChats messages={messages} />
              </div>
            )}
          </Box>

          {/* Message Input at Bottom (Fixed) */}
          <Box w="100%" p={3} bg="white" position="sticky" bottom={0} display="flex" gap={1}>
            <Input
              variant="filled"
              bg="#E0E0E0"
              placeholder="Enter a message"
              value={newMessage}
              onChange={typingHandler}
              onKeyDown={sendMessage}

            />
            <Button
             onClick={sendMessage1}
            >
              send
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default SingleChat;
