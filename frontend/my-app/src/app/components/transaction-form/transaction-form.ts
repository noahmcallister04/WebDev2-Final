import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TransactionService, Transaction } from '../../services/transaction';

@Component({
  selector: 'app-transaction-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.css',
})
export class TransactionForm implements OnInit {
  categories = ['Rent', 'Groceries', 'Dining Out', 'Transportation', 'Subscriptions', 'Going Out', 'Tuition', 'Textbooks', 'Income'];

  transaction: Transaction = {
    type: 'expense',
    amount: 0,
    category: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
    month: new Date().toISOString().slice(0, 7),
  };

  editId: string | null = null;
  errorMessage = '';

  constructor(
    private transactionService: TransactionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.editId = this.route.snapshot.paramMap.get('id');
    if (this.editId) {
      this.transactionService.getById(this.editId).subscribe({
        next: (data) => (this.transaction = data),
        error: () => (this.errorMessage = 'Failed to load transaction.'),
      });
    }
  }

  onDateChange(): void {
    if (this.transaction.date) {
      this.transaction.month = this.transaction.date.slice(0, 7);
    }
  }

  onSubmit(): void {
    if (this.editId) {
      this.transactionService.update(this.editId, this.transaction).subscribe({
        next: () => this.router.navigate(['/transactions']),
        error: () => (this.errorMessage = 'Failed to update transaction.'),
      });
    } else {
      this.transactionService.create(this.transaction).subscribe({
        next: () => this.router.navigate(['/transactions']),
        error: () => (this.errorMessage = 'Failed to create transaction.'),
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/transactions']);
  }
}
