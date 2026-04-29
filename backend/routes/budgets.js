const express = require('express');
const router = express.Router();
const { getBudgets, getBudgetById, createBudget, updateBudget, deleteBudget } = require('../controllers/budgetController');

router.get('/', getBudgets);
router.get('/:id', getBudgetById);
router.post('/', createBudget);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);

module.exports = router;
