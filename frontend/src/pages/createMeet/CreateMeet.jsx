import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./create-meet.css";
import { useRef } from "react";

function CreateMeet() {
    let content = [
        {
            label: "Meet name",
            controlId: "meetName",
            type: "text",
            placeholder: "Meet",
            val: useRef(null),
            enable: false,
        },
        {
            label: "Subject name",
            controlId: "subjectName",
            type: "text",
            placeholder: "Subject",
            val: useRef(null),
            enable: false,
        },
        {
            label: "Start time",
            controlId: "startTime",
            type: "date",
            placeholder: "",
            val: useRef(null),
            enable: false,
        },
        {
            label: "End time",
            controlId: "endTime",
            type: "date",
            placeholder: "",
            val: useRef(null),
            enable: false,
        },
        {
            label: "Teacher password",
            controlId: "teacherPass",
            type: "text",
            placeholder: "",
            val: useRef(null),
            enable: true,
        },
        {
            label: "Student password",
            controlId: "studentPass",
            type: "text",
            placeholder: "",
            val: useRef(null),
            enable: true,
        },
    ];

    return (
        <div className="create-meet container">
            <h3>Create a new meet</h3>
            {
                <Form>
                    {content.map((el, i) => {
                        return (
                            <>
                                <>
                                    {el.enable ? (
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
                                    ) : (
                                        ""
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
                                        disabled={el.enable}
                                        ref={el.val}
                                        key={`c${i}`}
                                        type={el.type}
                                        placeholder={el.placeholder}
                                    />
                                </Form.Group>
                            </>
                        );
                    })}

                    <Button
                        variant="primary"
                        onClick={() =>
                            console.log("baba", content[0].val.current.value)
                        }
                    >
                        Submit
                    </Button>
                </Form>
            }
            {/*
            <Form>
                <Form.Group className="mb-3" controlId="meetName">
                    <Form.Label>Meet name</Form.Label>
                    <Form.Control type="text" placeholder="Meet" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Check me out" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
			*/}
        </div>
    );
}

export default CreateMeet;
