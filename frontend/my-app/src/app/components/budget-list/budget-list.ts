import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BudgetService, Budget } from '../../services/budget';

@Component({
  selector: 'app-budget-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './budget-list.html',
  styleUrl: './budget-list.css',
})
export class BudgetList implements OnInit, OnDestroy {
  budgets: Budget[] = [];
  errorMessage = '';
  private sub!: Subscription;

  constructor(private budgetService: BudgetService, private router: Router) {}

  ngOnInit(): void {
    this.loadBudgets();
  }

  loadBudgets(): void {
    this.sub = this.budgetService.getAll().subscribe({
      next: (data) => (this.budgets = data),
      error: () => (this.errorMessage = 'Failed to load budgets.'),
    });
  }

  onEdit(id: string): void {
    this.router.navigate(['/budgets/edit', id]);
  }

  onDelete(id: string): void {
    if (confirm('Delete this budget?')) {
      this.budgetService.delete(id).subscribe({
        next: () => this.loadBudgets(),
        error: () => (this.errorMessage = 'Failed to delete budget.'),
      });
    }
  }

  onAdd(): void {
    this.router.navigate(['/budgets/new']);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
