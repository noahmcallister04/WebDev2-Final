import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TransactionService, Transaction } from '../../services/transaction';

@Component({
  selector: 'app-transaction-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.css',
})
export class TransactionList implements OnInit, OnDestroy {
  transactions: Transaction[] = [];

  filterCategory = '';
  filterType = '';
  filterMonth = '';

  categories = ['Rent', 'Groceries', 'Dining Out', 'Transportation', 'Subscriptions', 'Going Out', 'Tuition', 'Textbooks', 'Income'];

  errorMessage = '';
  private sub!: Subscription;

  constructor(private transactionService: TransactionService, private router: Router) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.sub?.unsubscribe();
    this.sub = this.transactionService.getAll({
      month: this.filterMonth || undefined,
      category: this.filterCategory || undefined,
      type: this.filterType || undefined,
    }).subscribe({
      next: (data) => (this.transactions = data),
      error: () => (this.errorMessage = 'Failed to load transactions. Is the backend running?'),
    });
  }

  applyFilters(): void {
    this.loadTransactions();
  }

  onEdit(id: string): void {
    this.router.navigate(['/transactions/edit', id]);
  }

  onDelete(id: string): void {
    if (confirm('Delete this transaction?')) {
      this.transactionService.delete(id).subscribe({
        next: () => this.loadTransactions(),
        error: () => (this.errorMessage = 'Failed to delete transaction.'),
      });
    }
  }

  onAdd(): void {
    this.router.navigate(['/transactions/new']);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
