/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { TableColumnHeaderProps, Th as ChakraTh } from "@chakra-ui/react";

export const Th = (props: TableColumnHeaderProps) => <ChakraTh {...props} />;
