import * as React from "react";
import { useState } from "react";
import UserMeetStatsModal from "../UserMeetStatsModel/UserMeetStatsModal";
import "./user-item.css";

function UserItem({ userData, meetData }) {
    const [clicked, setClicked] = useState(false);

    console.log("useritem", userData);
    console.log("meetdata", meetData);

    return (
        <>
            <div className="conr meet-item">
                <div className="meet-item left">
                    <div>{userData.userName}</div>
                </div>
                <button
                    type="button"
                    onClick={() => setClicked(true)}
                    className="btn btn-outline-primary w-50 meet-item hover"
                >
                    Statictics
                </button>
            </div>
            <UserMeetStatsModal
                open={clicked}
                setOpen={setClicked}
                user={userData}
                meet={meetData}
            />
        </>
    );
}

export default UserItem;
