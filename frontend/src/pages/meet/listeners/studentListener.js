const StudentListeners = (externalApi, meetId, token1) => {

	const sendToBackend = (method) => {
		const token = `?token=${token1}`;
		fetch(process.env.REACT_APP_API_LINK + `/meet/attendance/${method}` + token, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ meetId })
		}).then(res => console.log(`${method} meet`, res.status));
	}

	var eventID 

	externalApi.addListener("videoConferenceJoined", async (event) => {
		externalApi.executeCommand("toggleFilmStrip");
		//externalApi.executeCommand("toggleShareScreen");

		sendToBackend("enter");
		document.addEventListener("unload", () => sendToBackend("exit"));

		eventID = event.id;
		externalApi.addListener("contentSharingParticipantsChanged", (event) => {
			console.log("contentSharingParticipantsChanged");
			externalApi.pinParticipant(eventID);
		});

	});

	externalApi.addListener("screenSharingStatusChanged", (event) => {
		console.log("meho = " + event.on);
		console.log("meho =  " + event.details.sourceType);
	});

	externalApi.addListener("raiseHandUpdated", (event) => {
		console.log("raiseHandUpdated = " + event.id);
		console.log("raiseHandUpdated = " + event.handRaised);
	});

	externalApi.addListener("participantJoined", (event) => {
		console.log("participantJoined = " + event.id);
		console.log("participantJoined = " + event.displayName);
		console.log("contentSharingParticipantsChanged");
		externalApi.pinParticipant(event.id);
	});

	externalApi.addListener("videoConferenceLeft", (event) => {
		console.log("videoConferenceLeft = " + event.id);

		document.addEventListener("unload", () => { });
		sendToBackend("exit");
	});
};

export { StudentListeners };