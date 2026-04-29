import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { TransactionList } from './components/transaction-list/transaction-list';
import { TransactionForm } from './components/transaction-form/transaction-form';
import { BudgetList } from './components/budget-list/budget-list';
import { BudgetForm } from './components/budget-form/budget-form';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'transactions', component: TransactionList },
  { path: 'transactions/new', component: TransactionForm },
  { path: 'transactions/edit/:id', component: TransactionForm },
  { path: 'budgets', component: BudgetList },
  { path: 'budgets/new', component: BudgetForm },
  { path: 'budgets/edit/:id', component: BudgetForm },
];
