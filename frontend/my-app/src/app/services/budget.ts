import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Budget {
  _id?: string;
  category: string;
  monthlyLimit: number;
  month: string; // YYYY-MM
}

export interface BudgetSummary {
  category: string;
  monthlyLimit: number;
  spent: number;
  remaining: number;
  month: string;
}

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private apiUrl = 'http://localhost:3000/api/budgets';
  private summaryUrl = 'http://localhost:3000/api/summary';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Budget[]> {
    return this.http.get<Budget[]>(this.apiUrl);
  }

  getById(id: string): Observable<Budget> {
    return this.http.get<Budget>(`${this.apiUrl}/${id}`);
  }

  create(budget: Budget): Observable<Budget> {
    return this.http.post<Budget>(this.apiUrl, budget);
  }

  update(id: string, budget: Budget): Observable<Budget> {
    return this.http.put<Budget>(`${this.apiUrl}/${id}`, budget);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getSummary(): Observable<BudgetSummary[]> {
    return this.http.get<BudgetSummary[]>(this.summaryUrl);
  }
}
