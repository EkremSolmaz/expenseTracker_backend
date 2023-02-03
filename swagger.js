const swaggerAutogen = require("swagger-autogen")({
	autoQuery: false,
});

const doc = {
	info: {
		title: "expense-tracker-backend",
		description: "Description",
	},
	host: "localhost:3333",
	schemes: ["http"],
};

const outputFile = "./swagger.json";
const endpointsFiles = ["app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
