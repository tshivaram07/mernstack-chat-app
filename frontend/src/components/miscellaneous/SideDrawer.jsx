import { Box, Button, Text, Avatar, Input, Spinner } from "@chakra-ui/react";
import {
  MenuContent,
  MenuItem,
  MenuItemCommand,
  MenuRoot,
  MenuTrigger,
} from "../ui/menu";
import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { FaBell, FaChevronDown } from "react-icons/fa";
import React, { useState } from "react";
import { Tooltip } from "../ui/tooltip";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ChatState } from "../../Context/ChatProvider";
import ProfileBox from "./ProfileBox";
import { useNavigate } from "react-router-dom";
import ChatLoading from "./ChatLoading";
import { Toaster, toaster } from "../ui/toaster";
import axios from "axios";
import UserListItem from "../../userAvatar/userListItem";
import { getSender } from "../../config/ChatLogic";
const SideDrawer = () => {

  const navigate = useNavigate();
  const [search, setsearch] = useState("");
  const [searchResult, setsearchResult] = useState([]);
  const [loading, setloading] = useState(false);
  const [loadingChat, setloadingChat] = useState();
  const { user, setSelectedChat, chats, setChats ,notification ,setnotification } = ChatState();
  const [open, setOpen] = useState(false);
  const [view, setview] = useState(false)
  
   
const accessChat = async (userId) => {
  try {
    setloadingChat(true);
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };
    const { data } = await axios.post(
      "http://localhost:3000/api/chat",
      { userId },
      config
    );

    if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
    setSelectedChat(data);
  } catch (error) {
    toaster.create({
      title: `Error occurred`,
      type: "error",
    });
  } finally {
    setloadingChat(false);
  }
};
  const handlesearch= async ()=>{
    if(!search){
        toaster.create({
                    title: `please enter required details`,
                    type: "warning",
                  });
                  return;
    }
    try{
        setloading(true)
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(
          `http://localhost:3000/api/user?search=${search}`,
          config
        );
        setsearchResult(data);
        setloading(false);
    }catch(error){
        toaster.create({
                    title: `error occured`,
                    type: "error",
                  });
    }
  }
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignContent="center"
        backgroundColor="gray"
        h="50px"
        p={1}
      >
        <Tooltip showArrow content="This is the tooltip content">
          <Button variant="ghost" onClick={() => setOpen(true)}>
            {" "}
            {/* Opens Drawer */}
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }}>Search</Text>
          </Button>
        </Tooltip>
        <Text fontWeight="800">CHAT ME</Text>

        <div>
          <MenuRoot>
            <MenuTrigger asChild>
              <Button variant="ghost">
                <FaBell size="1px" /> {/* Bell Icon */}
                {notification.length > 0 && (
                  <Box
                    position="absolute"
                    top="0"
                    right="0"
                    background="red"
                    color="white"
                    fontSize="12px"
                    fontWeight="bold"
                    borderRadius="full"
                    width="18px"
                    height="18px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {notification.length}
                  </Box>
                )}
              </Button>
            </MenuTrigger>
            <MenuContent p={2}>
              {!notification.length && "no new messages"}
              {notification.map((notif) => (
                <MenuItem
                  value="new-file-a"
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setnotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `new message in ${notif.chat.chatName}`
                    : ` new message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuContent>
          </MenuRoot>
          <MenuRoot>
            <MenuTrigger asChild>
              <Button variant="ghost">
                <Avatar.Root>
                  <Avatar.Fallback cursor="pointer" name={user.name} />
                  <Avatar.Image src={user.profilePic} />
                </Avatar.Root>
                <FaChevronDown size={16} /> {/* Down Arrow Icon */}
              </Button>
            </MenuTrigger>
            <Box display="flex">
              <MenuContent>
                <Box display="flex" flexDirection="column" gap="5px">
                  <MenuItem value="profile">
                    <ProfileBox user={user}>View Profile</ProfileBox>
                  </MenuItem>

                  <MenuItem value="new-file-a" onClick={logoutHandler}>
                    Logout{" "}
                  </MenuItem>
                </Box>
              </MenuContent>
            </Box>
          </MenuRoot>
        </div>
      </Box>

      <DrawerRoot
        placement="left"
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
      >
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Search users</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <Box display="flex" gap="10px">
              <Input
                placeholder="Enter name..."
                value={search}
                onChange={(e) => setsearch(e.target.value)}
              />
              <Button colorScheme="blue" onClick={handlesearch}>
                Search
              </Button>
            </Box>
            <Box margin={3}>
              {loading ? (
                <ChatLoading />
              ) : (
                searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                ))
              )}
            </Box>
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
          <DrawerFooter>
            <DrawerActionTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerActionTrigger>
            <Button>Save</Button>
          </DrawerFooter>
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>
    </>
  );
};

export default SideDrawer;
