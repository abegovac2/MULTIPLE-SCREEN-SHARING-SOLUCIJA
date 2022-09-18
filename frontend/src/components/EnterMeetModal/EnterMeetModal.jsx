import { useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import "./enter-meet-modal.css";
import { useNavigate } from "react-router-dom";
import Toast from "react-bootstrap/Toast";
import { parseCookie } from "../../utils/ParseCookie";

function EnterMeetModal({ open, setOpen, meetInfo, goToInfo }) {
    const password = useRef(null);
    const navigate = useNavigate();
    const [showT, setShowT] = useState(false);
    const [textT, setTextT] = useState("");

    const formatDate = (dateStr) => {
        const [date, time] = dateStr.split("T");
        const [t1, t2] = time.split(".");
        return `${date} ${t1}`;
    };

    const goToMeet = async () => {
        let res = {};
        if (
            !!meetInfo.passwordProtected &&
            password.current.value.trim().length === 0
        ) {
            res = { status: 444 };
        } else if (!!meetInfo.passwordProtected) {
            res = await fetch(
                `${window.location.origin}/api` +
                    `/meet/enter?token=${parseCookie(
                        document.cookie
                    )}&meetName=${meetInfo.meetName}&subject=${
                        meetInfo.subject
                    }&password=${password.current.value.trim()}`,
                {
                    method: "GET",
                }
            );
        } else {
            res = await fetch(
                `${window.location.origin}/api` +
                    `/meet/enter?token=${parseCookie(
                        document.cookie
                    )}&meetName=${meetInfo.meetName}&subject=${
                        meetInfo.subject
                    }`,
                {
                    method: "GET",
                }
            );
        }
        if (res.status === 400) {
            setTextT("Invalid access data for meet");
            setShowT(true);
        } else if (res.status === 444) {
            setTextT("Missing password");
            setShowT(true);
        } else {
            let setup = await res.json();
            if (res.status === 409) {
                setTextT(setup.message);
                setShowT(true);
            } else {
                setup = { ...setup.meet, ...setup.setup };
                setup = JSON.stringify(setup);
                setup = btoa(setup);
                navigate({
                    pathname: "/meet",
                    search: `?data=${setup}`,
                });
            }
        }
    };
    return (
        <>
            <Modal show={open} centered>
                <Toast
                    className="toast position"
                    show={showT}
                    position="top-end"
                    delay={3000}
                    autohide={true}
                    onClose={() => setShowT(false)}
                >
                    <Toast.Header closeButton={false}>
                        <strong className="me-auto">Error</strong>
                    </Toast.Header>
                    <Toast.Body>{textT}</Toast.Body>
                </Toast>
                <Modal.Header>
                    <Modal.Title>
                        {meetInfo.meetName}
                        {" | "}
                        {meetInfo.subject}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <>
                        {!!meetInfo.passwordProtected && (
                            <Form
                                className="w-100"
                                onSubmit={goToMeet}
                                onKeyDown={(event) => {
                                    if (event.keyCode === 13) {
                                        event.preventDefault();
                                        goToMeet();
                                    }
                                }}
                            >
                                <Form.Group
                                    className="w-100"
                                    controlId="password"
                                >
                                    <Form.Label>Enter meet password</Form.Label>
                                    <Form.Control
                                        type="Password"
                                        placeholder="Password"
                                        ref={password}
                                    />
                                </Form.Group>
                            </Form>
                        )}
                        <br />
                        <div style={{ textAlign: "center" }}>
                            Created By: {meetInfo.createdBy}
                        </div>
                        <div style={{ textAlign: "center" }}>
                            Meet started at: {formatDate(meetInfo.startTime)}
                        </div>
                        {!!meetInfo.endTime && (
                            <div style={{ textAlign: "center" }}>
                                Meet ended at: {formatDate(meetInfo.endTime)}
                            </div>
                        )}
                        <br />
                    </>
                </Modal.Body>
                <Modal.Footer>
                    {!!goToInfo && (
                        <Button
                            style={{ fontWeight: "bold", fontSize: 15 }}
                            variant="secondary"
                            onClick={goToInfo}
                        >
                            &#9432;
                        </Button>
                    )}
                    <Button variant="secondary" onClick={() => setOpen(!open)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={goToMeet}>
                        Enter
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default EnterMeetModal;
