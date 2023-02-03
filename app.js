const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const swagger = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const expensesRoutes = require("./api/routes/expenses");
const userRoutes = require("./api/routes/users");

const password = process.env.MONGO_PWD || 'pwd';
mongoose.connect(
	`mongodb+srv://ekremsolmaz:${password}@cluster0.kjnvpsf.mongodb.net/?retryWrites=true&w=majority`
);

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/docs", swagger.serve, swagger.setup(swaggerDocument));

app.use("/expenses", expensesRoutes);
app.use("/users", userRoutes);

app.use((req, res, next) => {
	const error = new Error("Not Found");
	error.status = 404;
	next(error);
});

app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.json({
		error: {
			message: err.message,
			status: err.status,
		},
	});
});

module.exports = app;
