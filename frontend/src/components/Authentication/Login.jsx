import { Input, VStack, Button } from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  FormErrorIcon,
} from "@chakra-ui/form-control";
import React, { useState } from "react";
import axios from "axios";
import { Toaster, toaster } from "../ui/toaster";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [email, setemail] = useState()
  const [password, setpassword] = useState()
  const [loading, setloading] = useState(false)
    const navigate=useNavigate();
   const submit = async () => {
     setloading(true);
     if(!email || !password){
       toaster.create({
            title: `please enter required credentials`,
            type: "warning",
          });
          setloading(false);
        }
          try {
            const config = {
              headers: {
                "Content-type": "application/json",
              },
            };
            const { data } = await axios.post("http://127.0.0.1:3000/api/user/login",{email,password},config);
            toaster.create({
                    title: `login successfull`,
                    type: "success",
                  });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setloading(false);
            navigate("/chats");
          } catch (error) {
            toaster.create({
                    title: `error`,
                    type: "error",
                  });
                  setloading(false);
                  return;
          }
     };
  return (
    <VStack spacing="5px">
      <FormControl id="email">
        <FormLabel fontWeight={600}>Email</FormLabel>
        <Input
          placeholder="Enter your email"
          onChange={(e) => setemail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password">
        <FormLabel fontWeight={600}>Password</FormLabel>
        <Input
          type="password"
          placeholder="Enter your password"
          onChange={(e) => setpassword(e.target.value)}
        />
      </FormControl>
      
      <Button
        colorScheme="blue"
        width="40%"
        style={{ marginTop: 15 }}
        onClick={submit}
        isLoading={loading}
      >
        Login
      </Button>
    </VStack>
  );
};

export default Login;
