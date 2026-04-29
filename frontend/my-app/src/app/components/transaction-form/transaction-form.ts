import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TransactionService } from '../../services/transaction';

interface TransactionPayload {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
  note: string;
}

@Component({
  selector: 'app-transaction-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.css',
})
export class TransactionForm implements OnInit {
  categories = ['Rent', 'Groceries', 'Dining Out', 'Transportation', 'Subscriptions', 'Going Out', 'Tuition', 'Textbooks', 'Income'];

  transaction: TransactionPayload = {
    type: 'expense',
    amount: 0,
    category: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
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
        next: (data) => {
          this.transaction = {
            type: data.type,
            amount: data.amount,
            category: data.category,
            date: new Date(data.date).toISOString().split('T')[0],
            note: data.note ?? '',
          };
        },
        error: () => (this.errorMessage = 'Failed to load transaction.'),
      });
    }
  }

  onSubmit(): void {
    if (this.editId) {
      this.transactionService.update(this.editId, this.transaction).subscribe({
        next: () => this.router.navigate(['/transactions']),
        error: (err) => (this.errorMessage = err.error?.error ?? 'Failed to update transaction.'),
      });
    } else {
      this.transactionService.create(this.transaction).subscribe({
        next: () => this.router.navigate(['/transactions']),
        error: (err) => (this.errorMessage = err.error?.error ?? 'Failed to create transaction.'),
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/transactions']);
  }
}
