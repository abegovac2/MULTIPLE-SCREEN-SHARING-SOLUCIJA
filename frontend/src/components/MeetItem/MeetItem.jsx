import * as React from "react";
import { useEffect } from "react";
import { useState } from "react";
import EnterMeetModal from "../EnterMeetModal/EnterMeetModal";
import "./meet-item.css";

function MeetItem({ meetData, routeToMeet }) {
    const [clicked, setClicked] = useState(false);
    const [dataInfo, setData] = useState({});

    useEffect(() => {
        async function fetchData() {
            let dataGet = await fetch(process.env.API_LINK, {
                method: "GET",
                data: {
                    token: document.cookie.token,
                    meetName: meetData.meetName,
                    subject: meetData.subject,
                },
            });
            setData({
                id: 1,
                meetName: "nesto",
                passwordProtected: true,
                createdBy: "Meho Mehic",
                startTime: "123",
                endTime: "123",
            });
            //setData(dataGet.json());
        }
        fetchData();
    }, [clicked, meetData.meetName, meetData.subject]);

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
                meetInfo={dataInfo}
				goToMeet={routeToMeet}
            />
        </>
    );
}

export default MeetItem;
