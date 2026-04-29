import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Transaction {
  _id?: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
  note?: string;
  month?: string; // YYYY-MM — derived by the backend, read-only on the frontend
}

export interface TransactionFilters {
  month?: string;
  category?: string;
  type?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = 'http://localhost:3000/api/transactions';

  constructor(private http: HttpClient) {}

  getAll(filters?: TransactionFilters): Observable<Transaction[]> {
    let params = new HttpParams();
    if (filters?.month) params = params.set('month', filters.month);
    if (filters?.category) params = params.set('category', filters.category);
    if (filters?.type) params = params.set('type', filters.type);
    return this.http.get<Transaction[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
  }

  create(transaction: Omit<Transaction, '_id' | 'month'>): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, transaction);
  }

  update(id: string, transaction: Omit<Transaction, '_id' | 'month'>): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/${id}`, transaction);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
