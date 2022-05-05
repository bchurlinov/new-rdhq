/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { TableBodyProps, Tbody as ChakraTbody } from "@chakra-ui/react";

export const Tbody = (props: TableBodyProps) => <ChakraTbody {...props} />;
