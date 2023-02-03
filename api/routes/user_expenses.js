const express = require("express");
const router = express.Router({ mergeParams: true });

const mongoose = require("mongoose");
const User = require("../models/user");
const Expense = require("../models/expense");

router.get("/", async (req, res, next) => {
	// #swagger.tags = ['Users']
	// #swagger.description = 'Get user details by id'
	/*  #swagger.parameters = {name: 'filter[categories]', type: 'array'}*/
	/*  #swagger.parameters = {name: 'filter[minAmount]', type: 'number'}*/
	/*  #swagger.parameters = {name: 'filter[maxAmount]', type: 'number'}*/
	/*  #swagger.parameters = {name: 'filter[currency]', type: 'string'}*/
	/*  #swagger.parameters = {name: 'filter[from]', type: 'string'}*/
	/*  #swagger.parameters = {name: 'filter[to]', type: 'string'}*/

	let filterOptions = { amount: {}, date: {} };

	try {
		const categories = req?.query?.filter?.categories?.split(",");
		const minAmount = req?.query?.filter?.minAmount;
		const maxAmount = req?.query?.filter?.maxAmount;
		const currency = req?.query?.filter?.currency;
		let from = new Date(req?.query?.filter?.from);
		from = isNaN(from) ? undefined : from;
		let to = new Date(req?.query?.filter?.to);
		to = isNaN(to) ? undefined : to;

		if (categories?.length > 0) {
			filterOptions.category = categories;
		}
		if (currency) {
			filterOptions.currency = currency;
		}
		if (minAmount) {
			filterOptions.amount.$gte = minAmount;
		}
		if (maxAmount) {
			filterOptions.amount.$lte = maxAmount;
		}
		if (Object.keys(filterOptions.amount).length < 1) {
			delete filterOptions.amount;
		}
		if (from) {
			filterOptions.date.$gte = from;
		}
		if (to) {
			filterOptions.date.$lte = to;
		}
		if (Object.keys(filterOptions.date).length < 1) {
			delete filterOptions.date;
		}
		if (!mongoose.isValidObjectId(req.params.id)) {
			res.status(404).json({ error: "User not found" });
			return;
		}
		User.findById(req.params.id).then((user) => {
			if (!user) {
				res.status(404).json({ error: "User not found" });
				return;
			}
			Expense.find({
				...filterOptions,
				...{
					user: user._id,
				},
			})
				.exec()
				.then((userExpenses) => {
					userExpenses.sort(function (a, b) {
						return b.date - a.date;
					});
					res.status(200).json({ data: userExpenses });
				})
				.catch((err) => {
					res.status(500).json({ error: err });
				});
		});
	} catch (err) {
		return res.status(400).json({ error: "Bad request. " + err.message });
	}
});

module.exports = router;
