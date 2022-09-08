import React from "react";
import { Context } from "./NavbarShowContext";
import { useNavbarShowState } from "./useNavbarShowState";

export const NavbarShowProvider = ({ children }) => {
    const store = useNavbarShowState();

    return <Context.Provider value={store}>{children}</Context.Provider>;
};
