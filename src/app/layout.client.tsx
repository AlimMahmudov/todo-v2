"use client";
import ReduxProvaider from "@/provaider/ReduxProvaider";
import React, { FC, ReactNode } from "react";

interface LayoutClientProps {
  children: ReactNode;
}

const LayoutClient: FC<LayoutClientProps> = ({ children }) => {
  return (
    <>
      <ReduxProvaider>{children}</ReduxProvaider>
    </>
  );
};

export default LayoutClient;
