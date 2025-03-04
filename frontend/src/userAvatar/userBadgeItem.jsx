    import { Box } from '@chakra-ui/react'
    import React from 'react'
    import { FaTimes } from "react-icons/fa";
    const UserBadgeItem = ({user,handleFunction}) => {
    return (
        <Box
        display="flex"
        alignItems="center"
        gap={3}
        px={2}
        py={1}
        borderRadius="lg"
        m={1}
        mb={2}
        backgroundColor="black"
        color="white"
        fontSize={12}
        cursor="pointer"
        onClick={handleFunction}
        >
        {user.name}

        <FaTimes size={12} />
        </Box>
    );
    }

    export default UserBadgeItem