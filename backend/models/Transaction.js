const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['income', 'expense'], required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  note: { type: String, default: '' },
  month: { type: String, required: true } // "YYYY-MM"
});

module.exports = mongoose.model('Transaction', transactionSchema);
