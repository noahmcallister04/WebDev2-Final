const Budget = require('../models/Budget');

// GET /api/budgets
const getBudgets = async (req, res) => {
  try {
    const { month } = req.query;
    const filter = {};
    if (month) filter.month = month;

    const budgets = await Budget.find(filter);
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/budgets/:id
const getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) return res.status(404).json({ error: 'Budget not found' });
    res.json(budget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/budgets
const createBudget = async (req, res) => {
  try {
    const { category, monthlyLimit, month } = req.body;
    // prevent duplicate category+month combos
    const existing = await Budget.findOne({ category, month });
    if (existing) return res.status(409).json({ error: 'Budget for this category and month already exists' });

    const budget = await Budget.create({ category, monthlyLimit, month });
    res.status(201).json(budget);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT /api/budgets/:id
const updateBudget = async (req, res) => {
  try {
    const { category, monthlyLimit, month } = req.body;
    const budget = await Budget.findByIdAndUpdate(
      req.params.id,
      { category, monthlyLimit, month },
      { new: true, runValidators: true }
    );
    if (!budget) return res.status(404).json({ error: 'Budget not found' });
    res.json(budget);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/budgets/:id
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findByIdAndDelete(req.params.id);
    if (!budget) return res.status(404).json({ error: 'Budget not found' });
    res.json({ message: 'Budget deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getBudgets, getBudgetById, createBudget, updateBudget, deleteBudget };
