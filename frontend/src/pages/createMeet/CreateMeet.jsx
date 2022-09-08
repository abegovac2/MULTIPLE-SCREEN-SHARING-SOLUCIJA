import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./create-meet.css";
import { useRef, useState, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import { parseCookie } from "../../utils/ParseCookie";
import { Context } from "../../store/NavbarShowContext";

function CreateMeet() {
    let content = [
        {
            label: "Meet name",
            controlId: "meetName",
            type: "text",
            placeholder: "Meet",
            val: useRef(null),
            enable: false,
            feedback: "Missing meet name",
        },
        {
            label: "Subject name",
            controlId: "subjectName",
            type: "text",
            placeholder: "Subject",
            val: useRef(null),
            enable: false,
            feedback: "Missing subject name",
        },
        {
            label: "Start time",
            controlId: "startTime",
            type: "date",
            placeholder: "",
            val: useRef(null),
            enable: false,
            feedback: "Missing start time of meet",
        },
        {
            label: "End time",
            controlId: "endTime",
            type: "date",
            placeholder: "",
            val: useRef(null),
            enable: false,
            feedback: "Missing end time of meet",
        },
        {
            label: "Teacher password",
            controlId: "teacherPass",
            type: "text",
            placeholder: null,
            val: useRef(null),
            enable: true,
            feedback: "",
        },
        {
            label: "Student password",
            controlId: "studentPass",
            type: "text",
            placeholder: null,
            val: useRef(null),
            enable: true,
            feedback: "",
        },
    ];

    const [validated, setValidated] = useState(false);
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const { user } = useContext(Context);

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        console.log("mama mioja ", form.checkValidity());
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            const token = parseCookie(document.cookie);
            let addPass = {};
            if (content[5].val.current.value.trim().length !== 0) {
                addPass.studentPassword = content[5].val.current.value;
                if (content[4].val.current.value.trim().length !== 0)
                    addPass.teacherPassword = content[4].val.current.value;
            }

            const send = JSON.stringify({
                token: token,
                meetName: content[0].val.current.value,
                subject: content[1].val.current.value,
                createdBy: user.userName,
                startTime: content[2].val.current.value,
                endTime: content[3].val.current.value,
                ...addPass,
            });
            const res = await fetch(process.env.REACT_APP_API_LINK + "/meet", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: send,
            });
            const json = await res.json();
            if (res.status != 201) {
                setText(json.message);
            } else setText("Meet successfuly created");

            setOpen(true);
        }
        setValidated(true);
    };

    return (
        <div className="create-meet container">
            <h3>Create a new meet</h3>
            {
                <Form noValidate validated={validated}>
                    {content.map((el, i) => {
                        return (
                            <>
                                <>
                                    {el.enable && (
                                        <Form.Group
                                            key={`cb${i}`}
                                            className="mb-3"
                                            controlId="formBasicCheckbox"
                                        >
                                            <Form.Check
                                                onChange={() =>
                                                    (el.val.current.disabled =
                                                        !el.val.current
                                                            .disabled)
                                                }
                                                key={`cc${i}`}
                                                type="checkbox"
                                                label={`Enable ${el.label}`}
                                            />
                                        </Form.Group>
                                    )}
                                </>
                                <Form.Group
                                    key={`g${i}`}
                                    className="mb-3"
                                    controlId={el.controlId}
                                >
                                    <Form.Label key={`l${i}`}>
                                        {el.label}
                                    </Form.Label>
                                    <Form.Control
                                        required
                                        disabled={el.enable}
                                        ref={el.val}
                                        key={`c${i}`}
                                        type={el.type}
                                        placeholder={el.placeholder}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {el.feedback}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </>
                        );
                    })}

                    <Button
                        variant="primary"
                        onClick={(e) => {
                            handleSubmit(e);
                        }}
                    >
                        Submit
                    </Button>
                </Form>
            }
            <Modal show={open}>
                <Modal.Header>
                    <Modal.Title />
                </Modal.Header>
                <Modal.Body>
                    <h3 style={{ textAlign: "center" }}>{text}</h3>
                </Modal.Body>
                <Modal.Footer>
                    <div className="w-100">
                        <Button
                            variant="primary"
                            onClick={() => setOpen(false)}
                            className="w-100"
                        >
                            Ok
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default CreateMeet;
