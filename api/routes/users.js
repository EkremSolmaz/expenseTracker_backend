const express = require("express");
const router = express.Router();
const userExpensesRoutes = require("./user_expenses");

const mongoose = require("mongoose");
const User = require("../models/user");
const Expense = require("../models/expense");

router.get("/", (req, res, next) => {
	// #swagger.tags = ['Users']
	// #swagger.description = 'Get list of all users'
	User.find()
		.exec()
		.then((users) => {
			res.status(200).json({ data: users });
		})
		.catch((err) => res.status(500).json({ error: err }));
});

router.post("/", (req, res, next) => {
	// #swagger.tags = ['Users']
	// #swagger.description = 'Add a user'
	const user = new User({
		_id: mongoose.Types.ObjectId(),
		name: req.body.name,
	});
	user.save()
		.then(() => {
			res.status(201).json({});
		})
		.catch((err) => res.status(500).json({ error: err }));
});

router.get("/:id", (req, res, next) => {
	// #swagger.tags = ['Users']
	// #swagger.description = 'Get user details by id'
	User.findById(req.params.id)
		.exec()
		.then((user) => {
			if (!user) {
				return res.status(404).json({ error: "User not found" });
			}
			res.status(200).json({ data: user });
		})
		.catch((err) => res.status(500).json({ error: err }));
});

router.use("/:id/expenses", userExpensesRoutes);

module.exports = router;
