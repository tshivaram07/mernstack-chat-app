import React, { useEffect } from "react";
import {Container,Box,Text, Tabs } from "@chakra-ui/react"
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useNavigate } from "react-router-dom";
const Homepage = () => {
  const navigate=useNavigate();
  useEffect(() => {
    const user=JSON.parse(localStorage.getItem("userInfo"));
    if(user){
      navigate("/chats");
    }
  }, [navigate])
  
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="3xl" fontWeight={700}>
          CHAT ME
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="1g" borderWidth="1px">
        <Tabs.Root variant="enclosed" maxW="md" fitted defaultValue={"tab-1"}>
          <Tabs.List mb='1em'>
            <Tabs.Trigger value="tab-1">Login</Tabs.Trigger>
            <Tabs.Trigger value="tab-2">sign up</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab-1"><Login/></Tabs.Content>
          <Tabs.Content value="tab-2"><Signup/></Tabs.Content>
        </Tabs.Root>
      </Box>
    </Container>
  );
};

export default Homepage;
