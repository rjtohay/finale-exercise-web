import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { Todos } from '../models/todos';

@Injectable({
  providedIn: 'root'
})
export class TodosService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getTodos(): Observable<Todos[]> {
    return this.http.get<Todos[]>(this.API_URL);
  }

  createTodo(todo: Todos): Observable<Todos> {
    return this.http.post<Todos>(this.API_URL, todo);
  }

  updateTodo(id: string, todo: Partial<Todos>): Observable<Todos> {
    return this.http.put<Todos>(`${this.API_URL}/${id}`, todo);
  }

  deleteTodo(id: string): Observable<Todos> {
    return this.http.delete<Todos>(`${this.API_URL}/${id}`);
  }
}
