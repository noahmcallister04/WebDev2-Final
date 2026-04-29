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
  filtered: Transaction[] = [];

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
    this.sub = this.transactionService.getAll().subscribe({
      next: (data) => {
        this.transactions = data;
        this.applyFilters();
      },
      error: () => (this.errorMessage = 'Failed to load transactions.'),
    });
  }

  applyFilters(): void {
    this.filtered = this.transactions.filter((t) => {
      const matchCategory = this.filterCategory ? t.category === this.filterCategory : true;
      const matchType = this.filterType ? t.type === this.filterType : true;
      const matchMonth = this.filterMonth ? t.month === this.filterMonth : true;
      return matchCategory && matchType && matchMonth;
    });
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
