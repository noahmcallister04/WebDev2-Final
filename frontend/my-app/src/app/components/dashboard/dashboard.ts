import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { BudgetService, BudgetSummaryCategory, SummaryResponse } from '../../services/budget';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy {
  summary: SummaryResponse | null = null;
  currentMonth = new Date().toISOString().slice(0, 7);
  errorMessage = '';
  private sub!: Subscription;

  get categories(): BudgetSummaryCategory[] {
    return this.summary?.categories ?? [];
  }

  get totalIncome(): number {
    return this.summary?.totalIncome ?? 0;
  }

  get totalExpenses(): number {
    return this.summary?.totalExpenses ?? 0;
  }

  get netBalance(): number {
    return this.summary?.netBalance ?? 0;
  }

  getProgressPercent(cat: BudgetSummaryCategory): number {
    if (cat.monthlyLimit === 0) return 0;
    return Math.min((cat.spent / cat.monthlyLimit) * 100, 100);
  }

  getProgressClass(cat: BudgetSummaryCategory): string {
    if (cat.overBudget) return 'over';
    if (this.getProgressPercent(cat) >= 80) return 'warning';
    return '';
  }

  isNear(cat: BudgetSummaryCategory): boolean {
    return !cat.overBudget && this.getProgressPercent(cat) >= 80;
  }

  constructor(private budgetService: BudgetService) {}

  ngOnInit(): void {
    this.sub = this.budgetService.getSummary(this.currentMonth).subscribe({
      next: (data) => (this.summary = data),
      error: () => (this.errorMessage = 'Failed to load dashboard. Is the backend running?'),
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
