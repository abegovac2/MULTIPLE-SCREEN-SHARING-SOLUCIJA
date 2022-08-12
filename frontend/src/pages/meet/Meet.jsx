import React from "react";
import { JitsiMeeting } from "@jitsi/web-sdk";
import StudentListeners from "./listeners/studentListener.js";
import TeacherListener from "./listeners/teacherListener.js";

function Meet({
    domain,
    roomName,
    userInfo,
    configOverwrite,
    interfaceConfigOverwrite,
    isTeacher,
}) {
    return (
        <JitsiMeeting
            domain={domain}
            roomName={roomName}
            configOverwrite={configOverwrite}
            interfaceConfigOverwrite={interfaceConfigOverwrite}
            userInfo={userInfo}
            onApiReady={(externalApi) => {
                if (isTeacher) TeacherListener(externalApi);
                else StudentListeners(externalApi);
            }}
            getIFrameRef={(iframe) => {
                iframe.style.height = "100vh";
            }}
        />
    );
}

export default Meet;
