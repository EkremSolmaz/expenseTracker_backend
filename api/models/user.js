const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
	_id: { type: mongoose.Schema.Types.ObjectId, required: true },
	name: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("User", userSchema);
