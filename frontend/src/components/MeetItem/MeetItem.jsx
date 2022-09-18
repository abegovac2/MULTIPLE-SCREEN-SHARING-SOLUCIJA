import * as React from "react";
import { useState } from "react";
import EnterMeetModal from "../EnterMeetModal/EnterMeetModal";
import "./meet-item.css";
import { useNavigate } from "react-router-dom";

function MeetItem({ meetData }) {
    const [clicked, setClicked] = useState(false);
    const navigate = useNavigate();

    const routeToInfo = () => {
        navigate({
            pathname: "/meet-info",
            search: `?data=${btoa(JSON.stringify(meetData))}`,
        });
    };

    return (
        <>
            <div className="conr meet-item">
                <div className="meet-item left">
                    <div>{meetData.meetName}</div>
                    <div>{meetData.subject}</div>
                    <div>{meetData.createdBy}</div>
                </div>
                <button
                    type="button"
                    onClick={() => setClicked(!clicked)}
                    className="btn btn-outline-primary w-50 meet-item hover"
                >
                    <i className={"meet-item arrow rotate right"} />
                </button>
            </div>
            <EnterMeetModal
                open={clicked}
                setOpen={setClicked}
                goToInfo={routeToInfo}
                meetInfo={meetData}
            />
        </>
    );
}

export default MeetItem;
