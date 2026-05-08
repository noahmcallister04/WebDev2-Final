import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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

  get displayMonth(): string {
    const [year, month] = this.currentMonth.split('-').map(Number);
    return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  get isCurrentMonth(): boolean {
    return this.currentMonth === new Date().toISOString().slice(0, 7);
  }

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

  constructor(private budgetService: BudgetService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary(): void {
    this.sub?.unsubscribe();
    this.errorMessage = '';
    this.sub = this.budgetService.getSummary(this.currentMonth).subscribe({
      next: (data) => { this.summary = data; this.cdr.markForCheck(); },
      error: () => { this.errorMessage = 'Failed to load dashboard. Is the backend running?'; this.cdr.markForCheck(); },
    });
  }

  prevMonth(): void {
    const [year, month] = this.currentMonth.split('-').map(Number);
    const d = new Date(year, month - 2);
    this.currentMonth = d.toISOString().slice(0, 7);
    this.loadSummary();
  }

  nextMonth(): void {
    const [year, month] = this.currentMonth.split('-').map(Number);
    const d = new Date(year, month);
    this.currentMonth = d.toISOString().slice(0, 7);
    this.loadSummary();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
