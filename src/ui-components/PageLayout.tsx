import Typography from "@mui/material/Typography";
import NavBar from "./NavBar";
import React from "react";

type Props = {
    children?: React.ReactNode;
};

export const PageLayout: React.FC<Props> = ({children}) => {
    return (
        <>
            <NavBar />
            <br/>
            <br/>
            {children}
        </>
    );
};