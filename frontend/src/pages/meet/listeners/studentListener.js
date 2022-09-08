const StudentListeners = (externalApi, meetId, token1) => {
	externalApi.addListener("videoConferenceJoined", async (event) => {
		externalApi.executeCommand("toggleFilmStrip");
		//externalApi.executeCommand("toggleShareScreen");

		const token = `?token=${token1}`;
		fetch(process.env.REACT_APP_API_LINK + "/meet/attendance/enter" + token, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ meetId })
		}).then(res => console.log("enter meet", res.status));

		let participantId = event.id;
		externalApi.addListener("contentSharingParticipantsChanged", (event) => {
			console.log("contentSharingParticipantsChanged");
			externalApi.pinParticipant(participantId);
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
		const token = `?token=${token1}`;
		fetch(process.env.REACT_APP_API_LINK + "/meet/attendance/exit" + token, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ meetId })
		}).then(res => console.log("exit meet", res.status))
	});
};

export { StudentListeners };