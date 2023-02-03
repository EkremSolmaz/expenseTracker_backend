const express = require("express");
const router = express.Router();

const Expense = require("../models/expense");
const User = require("../models/user");
const mongoose = require("mongoose");

router.get("/", (req, res, next) => {
	// #swagger.tags = ['Expenses']
	Expense.find()
		.exec()
		.then((expenses) => {
			res.json({ data: expenses });
		})
		.catch((err) => res.status(500).json({ error: err }));
});

router.post("/", (req, res, next) => {
	// #swagger.tags = ['Expenses']
	User.findById(req.body.userId)
		.exec()
		.then((user) => {
			const expense = new Expense({
				_id: mongoose.Types.ObjectId(),
				user: req.body.userId,
				category: req.body.category,
				amount: req.body.amount,
				currency: req.body.currency,
				date: new Date(),
				description: req.body.description,
			});

			expense
				.save()
				.then((result) => {
					res.status(201).json({});
				})
				.catch((err) => {
					console.log(err);
					res.status(500).json({ error: err });
				});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: err });
		});

	// Promise.allSettled([userFind]).then(([user]) => {
	// 	if (!user.value) {
	// 		res.status(404).json({ error: "User does not exist" });
	// 		return;
	// 	}

	// 	const expense = new Expense({
	// 		_id: mongoose.Types.ObjectId(),
	// 		user: user.value._id,
	// 		category: req.body.category,
	// 		amount: req.body.amount,
	// 		currency: req.body.currency,
	// 		date: new Date(),
	// 		description: req.body.description,
	// 	});

	// 	expense
	// 		.save()
	// 		.then((result) => {
	// 			res.status(201).json({});
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 			res.status(500).json({ error: err });
	// 		});
	// });
});

router.get("/:id", (req, res, next) => {
	// #swagger.tags = ['Expenses']
	Expense.findById(req.params.id)
		.exec()
		.then((expense) => {
			if (!expense) {
				res.status(404).json({ error: "Expense does not exist" });
				return;
			}

			const userFind = User.findById(expense.user, "name").exec();

			Promise.allSettled([userFind])
				.then(([user]) => {
					res.status(200).json({
						data: {
							id: expense._id.toHexString(),
							amount: expense.amount,
							currency: expense.currency,
							date: expense.date,
							description: expense.description,
							category: expense.category,
							user: user.value.name,
						},
					});
				})
				.catch((error) => {
					res.status(500).json({ error: err });
				});
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
});

router.patch("/:id", (req, res, next) => {
	// #swagger.tags = ['Expenses']
	const userFind = User.findOne({ name: req.body.user }, "_id").exec();

	Promise.allSettled([userFind]).then(([user]) => {
		if (req.body.user && !user.value) {
			res.status(404).json({ error: "User does not exist" });
			return;
		}

		const newFields = {
			category: req.body.category,
			amount: req.body.amount,
			currency: req.body.currency,
			date: req.body.date,
			description: req.body.description,
		};
		if (req.body.user) {
			newFields.user = user.value._id;
		}

		Expense.findByIdAndUpdate(req.params.id, newFields)
			.exec()
			.then((expense) => {
				if (!expense) {
					res.status(404).json({ error: "Expense does not exist" });
					return;
				}
				res.status(200).json({});
			})
			.catch((err) => {
				res.status(500).json({ error: err });
			});
	});
});

router.delete("/:id", (req, res, next) => {
	// #swagger.tags = ['Expenses']
	Expense.findByIdAndRemove(req.params.id)
		.then((expense) => {
			if (expense) {
				res.status(202).json({});
			} else {
				res.status(404).json({ error: "Not Found" });
			}
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
});

module.exports = router;
