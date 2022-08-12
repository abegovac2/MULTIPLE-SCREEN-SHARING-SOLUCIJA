import * as React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import "./enter-meet-modal.css";

function EnterMeetModal({ open, setOpen, meetInfo, goToMeet }) {
    return (
        <Modal show={open} centered>
            <Modal.Header>
                <Modal.Title>{meetInfo.meetName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <>
                    {!!meetInfo.passwordProtected && (
                        <Form className="w-100">
                            <Form.Group className="w-100" controlId="password">
                                <Form.Label>Enter meet password</Form.Label>
                                <Form.Control
                                    type="Password"
                                    placeholder="Password"
                                    onChange={(e) =>
                                        console.log(e.target.value)
                                    }
                                />
                            </Form.Group>
                        </Form>
                    )}
                    <br />
                    <div style={{ textAlign: "center" }}>
                        Created By: {meetInfo.createdBy}
                    </div>
                    <div style={{ textAlign: "center" }}>
                        Meet started at: {meetInfo.startTime}
                    </div>
                    <div style={{ textAlign: "center" }}>
                        Meet ended at: {meetInfo.endTime}
                    </div>
                    <br />
                </>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setOpen(!open)}>
                    Close
                </Button>
                <Button variant="primary" onClick={goToMeet}>
                    Enter
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default EnterMeetModal;
