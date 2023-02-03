const mongoose = require("mongoose");

const expenseSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	category: {
		type: String,
		required: true,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	currency: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	description: {
		type: String,
	},
});

module.exports = mongoose.model("Expense", expenseSchema);
