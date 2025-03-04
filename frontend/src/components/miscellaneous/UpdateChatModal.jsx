import { Box, Button, Input, Stack } from "@chakra-ui/react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { ChatState } from "../../Context/ChatProvider";
import { Toaster, toaster } from "../ui/toaster";
import UserBadgeItem from "../../userAvatar/userBadgeItem";
import { Field } from "../ui/field";
import axios from "axios";
import UserListItem from "../../userAvatar/userListItem";

const UpdateChatModal = ({ fetchAgain, setfetchAgain, fetchMessages }) => {
  const [open, setOpen] = useState(false);
  const [groupChatName, setgroupChatName] = useState();
  const [search, setsearch] = useState("");
  const [searchResult, setsearchResult] = useState([]);
  const [loading, setloading] = useState(false);
  const [renameLoading, setrenameLoading] = useState(false);
  const { selectedChat, setSelectedChat, user } = ChatState();
  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setrenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:3000/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setSelectedChat(data);
      setfetchAgain(!fetchAgain);
      setrenameLoading(false);
    } catch (error) {
      toaster.create({
        title: `error occured`,
        type: "error",
      });
      setrenameLoading(false);
    }
    setgroupChatName("");
  };
  const handleSearch = async (querry) => {
    if (!querry) {
      return;
    }
    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:3000/api/user?search=${querry}`,
        config
      );
      console.log(data);
      setsearchResult(data);
      setloading(false);
    } catch (error) {
      toaster.create({
        title: `error occured`,
        type: "error",
      });
    }
  };
  const handleAddUser = async (usertoadd) => {
    if (selectedChat.users.find((u) => u.id == usertoadd._id)) {
      toaster.create({
        title: `error occured`,
        type: "error",
      });
      return;
    }
    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "http://localhost:3000/api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: usertoadd._id,
        },
        config
      );
      setSelectedChat(data);
      setfetchAgain(!fetchAgain);
      setloading(false);
    } catch (error) {
      toaster.create({
        title: `error occured`,
        type: "error",
      });
      setloading(false);
    }
  };
  const handleRemove = async (usertoadd) => {
    if (selectedChat.users.find((u) => u.id == usertoadd._id)) {
      toaster.create({
        title: `error occured`,
        type: "error",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "http://localhost:3000/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: usertoadd._id,
        },
        config
      );
      usertoadd._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setfetchAgain(!fetchAgain);
      fetchMessages();
      setloading(false);
    } catch (error) {
      toaster.create({
        title: `error occured`,
        type: "error",
      });
      setloading(false);
    }
  };
  return (
    <DialogRoot lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          onClick={() => setOpen(true)}
          _hover={{ color: "white", bg: "black" }}
          backgroundColor="white"
        >
          <FaEye size="1px" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{selectedChat.chatName}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Box display="flex">
            {selectedChat.users.map((user) => (
              <UserBadgeItem
                key={user._id}
                user={user}
                handleFunction={() => handleRemove(user)}
              />
            ))}
          </Box>
          <Stack gap="4">
            <Box display="flex">
              <Input
                value={groupChatName}
                onChange={(e) => setgroupChatName(e.target.value)}
                placeholder="Rename group"
              />
              <Button onClick={handleRename}>Update</Button>
            </Box>
            <Field label="Add Members">
              <Input
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Enter member names"
              />
            </Field>
          </Stack>
          {loading ? (
            <div>loading</div>
          ) : (
            searchResult?.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => handleAddUser(user)}
              />
            ))
          )}
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogActionTrigger>
          <Button onClick={() => handleRemove(user)} backgroundColor="red">
            Leave Group
          </Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default UpdateChatModal;
