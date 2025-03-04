import React from 'react'
import { HStack, Stack } from "@chakra-ui/react";
import {
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "../ui/skeleton";
const ChatLoading = () => {
  return (
    <Stack m="2px" gap="2">
        <Skeleton height="5" width="100%" />
        <Skeleton height="5" width="100%" />
        <Skeleton height="5" width="100%" />
    </Stack>
  );
}

export default ChatLoading