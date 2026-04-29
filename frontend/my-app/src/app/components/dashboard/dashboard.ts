import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { BudgetService, BudgetSummary } from '../../services/budget';
import { TransactionService, Transaction } from '../../services/transaction';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy {
  summaries: BudgetSummary[] = [];
  transactions: Transaction[] = [];
  currentMonth = new Date().toISOString().slice(0, 7);
  errorMessage = '';
  private subs: Subscription[] = [];

  get totalIncome(): number {
    return this.transactions
      .filter(t => t.type === 'income' && t.month === this.currentMonth)
      .reduce((sum, t) => sum + t.amount, 0);
  }

  get totalExpenses(): number {
    return this.transactions
      .filter(t => t.type === 'expense' && t.month === this.currentMonth)
      .reduce((sum, t) => sum + t.amount, 0);
  }

  get netBalance(): number {
    return this.totalIncome - this.totalExpenses;
  }

  getProgressPercent(summary: BudgetSummary): number {
    if (summary.monthlyLimit === 0) return 0;
    return Math.min((summary.spent / summary.monthlyLimit) * 100, 100);
  }

  getProgressClass(summary: BudgetSummary): string {
    const pct = this.getProgressPercent(summary);
    if (pct >= 100) return 'over';
    if (pct >= 80) return 'warning';
    return '';
  }

  isOver(summary: BudgetSummary): boolean {
    return summary.spent >= summary.monthlyLimit;
  }

  isNear(summary: BudgetSummary): boolean {
    const pct = this.getProgressPercent(summary);
    return pct >= 80 && pct < 100;
  }

  constructor(
    private budgetService: BudgetService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.subs.push(
      this.budgetService.getSummary().subscribe({
        next: (data) => (this.summaries = data),
        error: () => (this.errorMessage = 'Failed to load budget summary.'),
      })
    );
    this.subs.push(
      this.transactionService.getAll().subscribe({
        next: (data) => (this.transactions = data),
        error: () => (this.errorMessage = 'Failed to load transactions.'),
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }
}
