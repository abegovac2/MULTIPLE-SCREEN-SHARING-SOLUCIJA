import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import "./meet-info.css";
import UserItem from "../../components/UserItem/UserItem";
import { useSearchParams } from "react-router-dom";
import { parseCookie } from "../../utils/ParseCookie";

function MeetInfo() {
    const [text, setText] = useState("");
    const [results, setResults] = useState([]);
    const [list, setList] = useState([]);
    const [params] = useSearchParams();
    const [data1, setData1] = useState(JSON.parse(atob(params.get("data"))));

    useEffect(() => {
        async function fetchData() {
            const data = `?token=${parseCookie(document.cookie)}&id=${
                data1.id
            }`;
            let list = await fetch(
                `${window.location.origin}/api` + "/meet/attendance" + data,
                {
                    method: "GET",
                }
            );

            let allMeets = await list.json();
            console.log("sadfs", allMeets.attendance);

            setResults(allMeets.attendance);
            setList(allMeets.attendance);
        }
        fetchData();
    }, []);

    const filterList = (val) => {
        setText(!!val ? val : text);
        setResults(
            val.length === 0
                ? list
                : list.filter((user) => user.userName.includes(val))
        );
    };

    return (
        <div className="search container">
            <h1>
                {data1.meetName} | {data1.subject}
            </h1>
            <Form className="w-100">
                <Form.Group className="w-100" controlId="formBasicEmail">
                    <Form.Label>Search Users</Form.Label>
                    <Form.Control
                        type="Text"
                        placeholder="Search"
                        onChange={(e) => filterList(e.target.value)}
                    />
                    <Form.Text className="text-muted">
                        Enter user name
                    </Form.Text>
                </Form.Group>
                <button
                    type="button"
                    onClick={filterList}
                    className="btn btn-outline-primary search button"
                >
                    Search
                </button>
            </Form>
            <div className="result-field search">
                {!!results.length ? (
                    results.map((data, i) => (
                        <UserItem
                            key={`UItems${i}`}
                            userData={data}
                            meetData={data1}
                        />
                    ))
                ) : (
                    <h3>No results</h3>
                )}
            </div>
        </div>
    );
}

export default MeetInfo;
