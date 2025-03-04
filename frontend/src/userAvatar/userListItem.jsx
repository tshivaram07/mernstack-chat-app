import { Avatar, Box, Text } from '@chakra-ui/react'
import React from 'react'
const UserListItem = ({ user, handleFunction }) => {
  return(
     <Box
     onClick={handleFunction}
     cursor="pointer"
     bg="#E8E8E8"
     _hover={{
        background:"black",
        color:"white",
     }}
     w="100%"
     display="flex"
     alignItems="center"
     gap={3}
     px={3}
     py={2}
     mb={2}
     borderRadius="6px"
     >
        <Avatar.Root>
        <Avatar.Fallback size="sm" cursor="pointer" name={user.name} />
        <Avatar.Image src={user.profilePic} />
        </Avatar.Root>
        <Box>
            <Text>{user.name}</Text>
            <Text fontSize="xs">
                <b>Email:</b>
                {user.email}
            </Text>
        </Box>
     </Box>
     
  )
};

export default UserListItem