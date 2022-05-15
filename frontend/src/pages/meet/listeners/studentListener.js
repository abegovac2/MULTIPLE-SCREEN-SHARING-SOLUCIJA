const StudentListeners = (externalApi) => {
	externalApi.addListener("videoConferenceJoined", (event) => {
		externalApi.executeCommand("toggleFilmStrip");
		externalApi.executeCommand("toggleShareScreen");

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
	});

	externalApi.addListener("videoConferenceLeft", (event) => {
		console.log("videoConferenceLeft = " + event.id);
	});
};

module.exports = StudentListeners;