const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  category: { type: String, required: true },
  monthlyLimit: { type: Number, required: true },
  month: { type: String, required: true } // "YYYY-MM"
});

module.exports = mongoose.model('Budget', budgetSchema);
