import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:3000'; // Adjust backend URL as needed

  constructor(private http: HttpClient) {}

  getUserByEmail(email: string): Observable<User | null> {
    const params = new HttpParams().set('email', email);
    return this.http.get<{ exists: boolean; user?: User }>(`${this.baseUrl}/users`, { params }).pipe(
      map(response => {
        console.log('Respuesta getUserByEmail:', response);
        if (response.exists && response.user) {
          return response.user;
        }
        return null;
      }),
      catchError(() => of(null))
    );
  }

  createUser(email: string): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, { email });
  }
}
