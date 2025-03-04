import { Box, Button, Input, Stack } from "@chakra-ui/react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Field } from "../ui/field";
import { useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { set } from "mongoose";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import {Toaster, toaster } from "../ui/toaster";
import UserListItem from "../../userAvatar/userListItem";
import UserBadgeItem from "../../userAvatar/userBadgeItem";

const CreateGroupChat = () => {
  const ref = useRef(null);
  const { user, chats, setChats } = ChatState();
  const [selectedUser, setselectedUser] = useState([]);
  const [groupname, setgroupname] = useState();
  const [search, setsearch] = useState();
  const [searchResult, setsearchResult] = useState();
  const [loading, setloading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handlesearch = async (querry) => {
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
  const handleGroup = (usertoadd) => {
    if (selectedUser.find((user) => user._id === usertoadd._id)) {
      toaster.create({
        title: `user already added`,
        type: "error",
      });
      return;
    }
    setselectedUser([...selectedUser, usertoadd]);
  };
  const deleteuser = (usertodelete) => {
    setselectedUser(selectedUser.filter((sel) => sel._id !== usertodelete._id));
  };
  const handleSubmit = async () => {
    if (!groupname || !selectedUser) {
      toaster.create({
        title: `fill required feilds`,
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
      const { data } = await axios.post(
        "http://localhost:3000/api/chat/group",
        {
          name: groupname,
          users: JSON.stringify(selectedUser.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      setIsDialogOpen(false);
      toaster.create({
        title: `group created successfully`,
        type: "success",
      });
    } catch (error) {
      toaster.create({
        title: `error occured`,
        type: "error",
      });
    }
  };
  return (
    <>
    <Toaster/>
    <DialogRoot open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {/* Button to open the dialog */}
      <DialogTrigger asChild>
        <Button variant="outline">
          New Group Chat{" "}
          <FaPlus style={{ fontSize: "14px", marginLeft: "8px" }} />
        </Button>
      </DialogTrigger>

      {/* Dialog Component */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Group Chat</DialogTitle>
        </DialogHeader>
        <DialogBody pb="4">
          <Stack gap="4">
            <Field label="Group Name">
              <Input
                onChange={(e) => setgroupname(e.target.value)}
                placeholder="Enter Group Name"
              />
            </Field>
            <Field label="Add Members">
              <Input
                onChange={(e) => handlesearch(e.target.value)}
                placeholder="Enter member names"
                />
            </Field>
          </Stack>
          <Box display="flex" w={100}>
            {selectedUser.map((user) => (
              <UserBadgeItem
              key={user._id}
              user={user}
              handleFunction={() => deleteuser(user)}
              />
            ))}
          </Box>
          {loading ? (
            <div>loading</div>
          ) : (
            searchResult?.map((user) => (
              <UserListItem
              key={user._id}
              user={user}
              handleFunction={() => handleGroup(user)}
              />
            ))
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>

          <Button onClick={handleSubmit}>Create Group </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
    </>
  );
};

export default CreateGroupChat;
