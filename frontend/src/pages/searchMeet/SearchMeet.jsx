import React from "react";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import "./search-meet.css";
import MeetItem from "../../components/MeetItem/MeetItem.jsx";
import { useEffect } from "react";

function SearchMeet() {
    const [text, setText] = useState("");
    const [results, setResults] = useState([]);
    const [list, setList] = useState([]);
    useEffect(() => {
        async function fetchData() {
            /*list = await fetch(process.env.API_LINK + "/list", {
				method: "GET",
			data: {
				token: document.cookie.token,
			},
		});
		*/
            let allMeets = [
                { meetName: "meet1", subject: "RPR", createdBy: "Meho Mehic" },
                { meetName: "meet2", subject: "RPR", createdBy: "Meho Mehic" },
                { meetName: "meet3", subject: "RPR", createdBy: "Meho Mehic" },
                { meetName: "meet4", subject: "RPR", createdBy: "Meho Mehic" },
                { meetName: "meet5", subject: "RPR", createdBy: "Meho Mehic" },
                { meetName: "meet6", subject: "RPR", createdBy: "Meho Mehic" },
                { meetName: "meet7", subject: "RPR", createdBy: "Meho Mehic" },
            ];
            setList(allMeets);
            setResults(allMeets);
        }
        fetchData();
    }, []);

    const filterList = (val) => {
        setText(!!val ? val : text);
        setResults(
            val.length === 0
                ? list
                : list.filter((meet) => meet.meetName.includes(val))
        );
    };

    return (
        <div className="search container">
            <Form className="w-100">
                <Form.Group className="w-100" controlId="formBasicEmail">
                    <Form.Label>Search Meets</Form.Label>
                    <Form.Control
                        type="Text"
                        placeholder="Search"
                        onChange={(e) => filterList(e.target.value)}
                    />
                    <Form.Text className="text-muted">
                        Enter meet name
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
                        <MeetItem
                            key={i}
                            meetData={data}
                            enterMeet={() => {}}
                        />
                    ))
                ) : (
                    <h3>No results</h3>
                )}
            </div>
        </div>
    );
}

export default SearchMeet;
