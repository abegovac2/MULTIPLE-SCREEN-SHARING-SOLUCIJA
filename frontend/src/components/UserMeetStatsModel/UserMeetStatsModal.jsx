import * as React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./user-meet-stats-modal.css";
import Badge from "react-bootstrap/Badge";
import parseCookie from "../../utils/parseCookie.js";

function UserMeetStatsModal({ open, setOpen, user, meet }) {
    const [attendance, setAttendance] = useState([]);

    useEffect(() => {
        async function fetchData() {
            if (!user || !meet) return <></>;

            const data = `?token=${parseCookie(document.cookie)}&userId=${
                user.id
            }&meetId=${meet.id}`;
            let arr = await fetch(
                process.env.REACT_APP_API_LINK + "/meet/user-attendance" + data,
                {
                    method: "GET",
                }
            );
            arr = await arr.json();
            arr = arr.userAttendance;
            setAttendance(arr);
        }
        fetchData();
    }, []);
    if (!user || !meet) {
        console.log("user", user);
        console.log("meet", meet);
        return <></>;
    }

    const formatDate = (dateStr) => {
        const [date, time] = dateStr.split("T");
        const [t1, t2] = time.split(".");
        return `${date} ${t1}`;
    };

    return (
        <Modal show={open} centered>
            <Modal.Header>
                <Modal.Title>{user.userName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <>
                    <div>
                        {attendance.map((el, i) => (
                            <>
                                <div
                                    key={`a${i}`}
                                    className="w-100"
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <div key={`b${i}`}>
                                        {
                                            formatDate(
                                                el.createdAt
                                            ) /*Date.parse().toLocaleString()*/
                                        }
                                    </div>
                                    <div key={`c${i}`}>
                                        <Badge
                                            key={`bbbbb${i}`}
                                            bg={
                                                el.action === "ENTER"
                                                    ? "success"
                                                    : "danger"
                                            }
                                            style={{ color: "white" }}
                                        >
                                            {el.action}
                                        </Badge>
                                    </div>
                                </div>
                                <hr key={`hhh${i}`} />
                            </>
                        ))}
                    </div>
                </>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setOpen(false)}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UserMeetStatsModal;
