var http = require("http");

async function getip(options) {
	return new Promise((resolve, reject) => {
		http.get({ host: "api.ipify.org", port: 80, path: "/" }, function (resp) {
			resp.on("data", function (ip) {
				resolve(ip);
			});
		});
	});
}

async function generateSwagger() {
	// const host = (await getip()).toString();
	const host = "localhost";

	const swaggerAutogen = require("swagger-autogen")({
		autoQuery: false,
	});

	const doc = {
		info: {
			title: "expense-tracker-backend",
			description: "Description",
		},
		host: host,
		schemes: ["http"],
	};

	const outputFile = "./swagger.json";
	const endpointsFiles = ["app.js"];

	swaggerAutogen(outputFile, endpointsFiles, doc);
}

generateSwagger();
