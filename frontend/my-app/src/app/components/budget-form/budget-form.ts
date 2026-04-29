import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BudgetService, Budget } from '../../services/budget';

@Component({
  selector: 'app-budget-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './budget-form.html',
  styleUrl: './budget-form.css',
})
export class BudgetForm implements OnInit {
  categories = ['Rent', 'Groceries', 'Dining Out', 'Transportation', 'Subscriptions', 'Going Out', 'Tuition', 'Textbooks'];

  budget: Budget = {
    category: '',
    monthlyLimit: 0,
    month: new Date().toISOString().slice(0, 7),
  };

  editId: string | null = null;
  errorMessage = '';

  constructor(
    private budgetService: BudgetService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.editId = this.route.snapshot.paramMap.get('id');
    if (this.editId) {
      this.budgetService.getById(this.editId).subscribe({
        next: (data) => (this.budget = data),
        error: () => (this.errorMessage = 'Failed to load budget.'),
      });
    }
  }

  onSubmit(): void {
    if (this.editId) {
      this.budgetService.update(this.editId, this.budget).subscribe({
        next: () => this.router.navigate(['/budgets']),
        error: () => (this.errorMessage = 'Failed to update budget.'),
      });
    } else {
      this.budgetService.create(this.budget).subscribe({
        next: () => this.router.navigate(['/budgets']),
        error: () => (this.errorMessage = 'Failed to create budget.'),
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/budgets']);
  }
}
