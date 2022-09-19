const StudentListeners = (externalApi, meetId, token1, navigate) => {

	const sendToBackend = (method) => {
		const token = `?token=${token1}`;
		fetch(`${window.location.origin}/api` + `/meet/attendance/${method}` + token, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ meetId })
		}).then(res => console.log(`${method} meet`, res.status));
	}

	var sendToBackendExit = (function() {
		var e = false;
		return function() {
			if (!e) {
				e = true;
				sendToBackend("exit")
			}
		};
	})();

	const func = (e) => sendToBackendExit();

	const setupEventListeners = (enable) => {
		const events = ["popstate"];
		if(enable) events.forEach((e) => window.addEventListener(e, func))
		else events.forEach((e) => window.removeEventListener(e, func))
	}

	var eventID

	externalApi.addListener("videoConferenceJoined", async (event) => {
		externalApi.executeCommand("toggleFilmStrip");
		//externalApi.executeCommand("toggleShareScreen");

		sendToBackend("enter");
		//window.addEventListener("unload", () => sendToBackend("exit"));

		setupEventListeners(true);

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

		//window.addEventListener("unload", () => { });
		setupEventListeners(false);
		sendToBackendExit();
		navigate("/search");
	});
};

export { StudentListeners };