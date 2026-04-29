const Transaction = require('../models/Transaction');

// GET /api/transactions
const getTransactions = async (req, res) => {
  try {
    const { month, category, type } = req.query;
    const filter = {};
    if (month) filter.month = month;
    if (category) filter.category = category;
    if (type) filter.type = type;

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/transactions/:id
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/transactions
const createTransaction = async (req, res) => {
  try {
    const { type, amount, category, date, note } = req.body;
    const month = new Date(date).toISOString().slice(0, 7); // auto-derive YYYY-MM
    const transaction = await Transaction.create({ type, amount, category, date, note, month });
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT /api/transactions/:id
const updateTransaction = async (req, res) => {
  try {
    const { type, amount, category, date, note } = req.body;
    const updates = { type, amount, category, date, note };
    if (date) updates.month = new Date(date).toISOString().slice(0, 7);

    const transaction = await Transaction.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    res.json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/transactions/:id
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getTransactions, getTransactionById, createTransaction, updateTransaction, deleteTransaction };
