const mongoose = require('mongoose');
const Transaction = require('./models/Transaction');
const Budget = require('./models/Budget');
require('dotenv').config();

const MONTH = '2025-04';

const budgets = [
  { category: 'Rent', monthlyLimit: 800, month: MONTH },
  { category: 'Groceries', monthlyLimit: 200, month: MONTH },
  { category: 'Dining Out', monthlyLimit: 150, month: MONTH },
  { category: 'Transportation', monthlyLimit: 100, month: MONTH },
  { category: 'Subscriptions', monthlyLimit: 50, month: MONTH },
  { category: 'Going Out', monthlyLimit: 100, month: MONTH },
];

const transactions = [
  // Income
  { type: 'income', amount: 1200, category: 'Income', date: '2025-04-01', note: 'Part-time job paycheck', month: MONTH },
  { type: 'income', amount: 500, category: 'Income', date: '2025-04-15', note: 'Parents transfer', month: MONTH },

  // Rent
  { type: 'expense', amount: 800, category: 'Rent', date: '2025-04-01', note: 'April rent', month: MONTH },

  // Groceries
  { type: 'expense', amount: 60, category: 'Groceries', date: '2025-04-03', note: 'Aldi run', month: MONTH },
  { type: 'expense', amount: 45, category: 'Groceries', date: '2025-04-10', note: 'Trader Joes', month: MONTH },
  { type: 'expense', amount: 55, category: 'Groceries', date: '2025-04-18', note: 'Weekly groceries', month: MONTH },
  { type: 'expense', amount: 30, category: 'Groceries', date: '2025-04-25', note: 'Quick trip', month: MONTH },

  // Dining Out
  { type: 'expense', amount: 22, category: 'Dining Out', date: '2025-04-05', note: 'Chipotle with friends', month: MONTH },
  { type: 'expense', amount: 35, category: 'Dining Out', date: '2025-04-11', note: 'Birthday dinner', month: MONTH },
  { type: 'expense', amount: 18, category: 'Dining Out', date: '2025-04-17', note: 'Panda Express', month: MONTH },
  { type: 'expense', amount: 40, category: 'Dining Out', date: '2025-04-22', note: 'Sushi with roommate', month: MONTH },
  { type: 'expense', amount: 28, category: 'Dining Out', date: '2025-04-27', note: 'Late night pizza', month: MONTH },

  // Transportation
  { type: 'expense', amount: 40, category: 'Transportation', date: '2025-04-02', note: 'Gas', month: MONTH },
  { type: 'expense', amount: 25, category: 'Transportation', date: '2025-04-14', note: 'Uber to airport', month: MONTH },
  { type: 'expense', amount: 40, category: 'Transportation', date: '2025-04-23', note: 'Gas again', month: MONTH },

  // Subscriptions
  { type: 'expense', amount: 16, category: 'Subscriptions', date: '2025-04-01', note: 'Spotify + Hulu', month: MONTH },
  { type: 'expense', amount: 18, category: 'Subscriptions', date: '2025-04-01', note: 'Netflix', month: MONTH },
  { type: 'expense', amount: 11, category: 'Subscriptions', date: '2025-04-05', note: 'ChatGPT', month: MONTH },

  // Going Out
  { type: 'expense', amount: 30, category: 'Going Out', date: '2025-04-06', note: 'Bowling night', month: MONTH },
  { type: 'expense', amount: 45, category: 'Going Out', date: '2025-04-13', note: 'Concert tickets', month: MONTH },
  { type: 'expense', amount: 20, category: 'Going Out', date: '2025-04-19', note: 'Mini golf', month: MONTH },
  { type: 'expense', amount: 50, category: 'Going Out', date: '2025-04-26', note: 'Bar with friends', month: MONTH },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Transaction.deleteMany({});
    await Budget.deleteMany({});
    console.log('Cleared existing data');

    await Budget.insertMany(budgets);
    console.log('Budgets seeded');

    await Transaction.insertMany(transactions);
    console.log('Transactions seeded');

    console.log('Seed complete');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seed();
