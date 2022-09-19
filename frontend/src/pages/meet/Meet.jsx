import React, { useContext } from "react";
import { JitsiMeeting } from "@jitsi/web-sdk";
import { StudentListeners } from "./listeners/studentListener.js";
import { useSearchParams, useNavigate } from "react-router-dom";
import { parseCookie } from "../../utils/ParseCookie";
import { Context } from "../../store/NavbarShowContext";

function Meet() {
    const [params] = useSearchParams();
    const setup = JSON.parse(atob(params.get("data")));
    const { user } = useContext(Context);
	const navigate = useNavigate();

    console.log("useruser", user);

    const domain = "meet.jit.si";
    const roomName = `${setup.meetName}-${setup.subject}`;
    const userInfo = { displayName: user.userName };

    const { configOverwrite, interfaceConfigOverwrite } = setup;
    const token = parseCookie(document.cookie);

    return (
        <JitsiMeeting
            domain={domain}
            roomName={roomName}
            configOverwrite={configOverwrite}
            interfaceConfigOverwrite={interfaceConfigOverwrite}
            userInfo={userInfo}
            onApiReady={(externalApi) => {
                if (!!configOverwrite.toolbarButtons)
                    StudentListeners(externalApi, setup.id, token, navigate);
            }}
            getIFrameRef={(iframe) => {
                iframe.style.height = "100vh";
            }}
        />
    );
}

export default Meet;
