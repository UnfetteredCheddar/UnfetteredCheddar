if (Meteor.isServer) {
	process.env.MAIL_URL="smtp://GobblerGonnaGobble%40gmail.com:$Cranberry!@smtp.gmail.com:465/"; 
	process.env.TWILIO_NUMBER = "19253266702";
	process.env.TWILIO_ACCOUNT_SID = "ACbd73f4c9b4ff89d7863bb6f8e3f57c3d";
	process.env.TWILIO_AUTH_TOKEN = "f420beddf8859d64a37cdd0b282693fa";
}
