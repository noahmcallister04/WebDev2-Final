// controllers/summaryController.js
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

const getSummary = async (req, res) => {
  try {
    const { month } = req.query; // e.g. "2025-04"
    if (!month) return res.status(400).json({ error: 'month query param required' });

    // Aggregate expense totals by category for the month
    const spending = await Transaction.aggregate([
      { $match: { month, type: 'expense' } },
      { $group: { _id: '$category', spent: { $sum: '$amount' } } }
    ]);

    // Pull budgets for the month
    const budgets = await Budget.find({ month });

    // Merge: for each budget, find matching spending
    const summary = budgets.map(b => {
      const match = spending.find(s => s._id === b.category);
      const spent = match ? match.spent : 0;
      return {
        category: b.category,
        monthlyLimit: b.monthlyLimit,
        spent,
        remaining: b.monthlyLimit - spent,
        overBudget: spent > b.monthlyLimit
      };
    });

    // Top-level totals
    const totalIncome = await Transaction.aggregate([
      { $match: { month, type: 'income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalExpenses = await Transaction.aggregate([
      { $match: { month, type: 'expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const income = totalIncome[0]?.total ?? 0;
    const expenses = totalExpenses[0]?.total ?? 0;

    res.json({
      month,
      totalIncome: income,
      totalExpenses: expenses,
      netBalance: income - expenses,
      categories: summary
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getSummary };
