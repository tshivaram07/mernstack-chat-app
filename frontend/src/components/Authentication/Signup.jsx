import { Input, VStack, Button } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import React, { useState } from "react";
import axios from "axios";
import { Toaster, toaster } from "../ui/toaster";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");
  const [image, setimage] = useState("");
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
const profileset = async (image) => {
  setloading(true);

  if (!image) {
    toaster.create({
      title: `Please select an image`,
      type: "warning",
    });
    setloading(false);
    return;
  }

  if (image.type !== "image/jpeg" && image.type !== "image/png") {
    toaster.create({
      title: `Please select a valid image format (JPEG/PNG)`,
      type: "warning",
    });
    setloading(false);
    return;
  }

  console.log("Uploading image to Cloudinary...");
  console.log("File Type:", image.type);

  const data = new FormData();
  data.append("file", image);
  data.append("upload_preset", "chat-app");
  data.append("cloud_name", "shiva07");

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/shiva07/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const resData = await response.json();
    console.log("Response from Cloudinary:", resData);

    if (resData.secure_url) {
      setimage(resData.secure_url);
      console.log("Image URL set to:", resData.secure_url);
      toaster.create({
        title: `Image uploaded successfully`,
        type: "success",
      });
    } else {
      toaster.create({
        title: `Image upload failed`,
        type: "error",
      });
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    toaster.create({
      title: `Error uploading image`,
      type: "error",
    });
  } finally {
    setloading(false);
  }
};

  const submit = async () => {
    setloading(true);

    if (!name || !email || !password || !confirmpassword) {
      toaster.create({
        title: `Enter required fields`,
        type: "warning",
      });
      setloading(false);
      return;
    }

    if (password !== confirmpassword) {
      toaster.create({
        title: `Passwords do not match`,
        type: "warning",
      });
      setloading(false);
      return;
    }

    if (!image) {
      toaster.create({
        title: `Please upload a profile image`,
        type: "warning",
      });
      setloading(false);
      return;
    }

    console.log("Submitting with image:", image);

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "http://127.0.0.1:3000/api/user",
        { name, email, password, profilePic:image },
        config
      );

      toaster.create({
        title: `Registration successful`,
        type: "success",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setloading(false);
      navigate("/chats");
    } catch (error) {
      toaster.create({
        title: `Error registering user`,
        type: "error",
      });
      setloading(false);
    }
  };

  return (
    <VStack spacing="5px">
      <Toaster />
      <FormControl id="name">
        <FormLabel fontWeight={600}>Name</FormLabel>
        <Input
          placeholder="Enter your name"
          onChange={(e) => setname(e.target.value)}
        />
      </FormControl>

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

      <FormControl id="confirm-password">
        <FormLabel fontWeight={600}>Confirm Password</FormLabel>
        <Input
          type="password"
          placeholder="Confirm password"
          onChange={(e) => setconfirmpassword(e.target.value)}
        />
      </FormControl>

      <FormControl id="image">
        <FormLabel fontWeight={600}>Upload Profile Image</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => profileset(e.target.files[0])}
        />
      </FormControl>

      <Button
        colorSchema="blue"
        width="40%"
        style={{ marginTop: 15 }}
        onClick={submit}
        isLoading={loading}
      >
        Sign up
      </Button>
    </VStack>
  );
};

export default Signup;
