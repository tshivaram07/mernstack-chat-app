import React, { useState } from "react";
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
import { Button, IconButton, Avatar, Box, Text } from "@chakra-ui/react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FaEye } from "react-icons/fa";

const ProfileBox = ({ user, children,}) => {
  const [view2, setview2] = useState(false)
  const setView2=()=>{
    setview2(false);
  }

  return (
    <>
      {children ? (
        <span onClick={() => setview2(true)}>{children}</span>
      ) : (
        <Button variant="ghost" onClick={() => setview2(true)}
        _hover={{color:"white", bg:"black"}}
        backgroundColor="none"
        borderRadius="100px"
        width="40px"
        >
        <FaEye size="1px" />
        </Button>
      )}

      {/* Profile Dialog */}
      <DialogRoot
        lazyMount
        open={view2}
        onOpenChange={(open) => setView2(open)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle fontSize="2xl" fontWeight="bold">
              User Profile
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Box  display="flex" flexDirection="column" alignItems="center">
              {/* Bigger Profile Picture */}
              <Avatar.Root>
                <Avatar.Fallback cursor="pointer" name={user.name} />
                <Avatar.Image src={user.profilePic} />
              </Avatar.Root>

              {/* Bigger Font Sizes */}
              <Text fontSize="2xl" fontWeight="bold" mt={4}>
                {user?.name || "Unknown User"}
              </Text>
              <Text fontSize="lg" color="gray.600">
                {user?.email || "No Email Provided"}
              </Text>
            </Box>
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button
                variant="outline"
                fontSize="lg"
                onClick={() => setview2(false)}
              >
                Close
              </Button>
            </DialogActionTrigger>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    </>
  );
};

export default ProfileBox;
