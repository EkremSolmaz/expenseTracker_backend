const swaggerAutogen = require("swagger-autogen")({
	autoQuery: false,
});

const doc = {
	info: {
		title: "expense-tracker-backend",
		description: "Description",
	},
	host: "ec2-54-208-202-10.compute-1.amazonaws.com:3333",
	schemes: ["http"],
};

const outputFile = "./swagger.json";
const endpointsFiles = ["app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
