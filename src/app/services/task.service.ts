import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Task {
  id: string;
  userId?: string;
  title: string;
  description?: string;
  createdAt: string | Date | null;
  completed: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl = 'https://backend-challenge-atom-8sq5mikod-christians-projects-7f3140a3.vercel.app'; // Ajustar URL del backend según sea necesario

  constructor(private http: HttpClient) {}

  getTasks(userId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/tasks?userId=${encodeURIComponent(userId)}`).pipe(
      map(tasks =>
        tasks.map(task => {
          let createdAtDate: Date | null = null;
          if (task.createdAt) {
            if (typeof task.createdAt === 'object') {
              if ('toDate' in (task.createdAt as any)) {
                createdAtDate = (task.createdAt as any).toDate();
              } else if ('_seconds' in (task.createdAt as any) && '_nanoseconds' in (task.createdAt as any)) {
                // Convertir Firestore Timestamp-like object a Date
                const seconds = (task.createdAt as any)._seconds;
                const nanoseconds = (task.createdAt as any)._nanoseconds;
                createdAtDate = new Date(seconds * 1000 + nanoseconds / 1000000);
              }
            } else if (typeof task.createdAt === 'string' || (task.createdAt && typeof task.createdAt === 'object' && 'getTime' in task.createdAt)) {
              createdAtDate = new Date(task.createdAt);
            }
          }
          return {
            ...task,
            createdAt: createdAtDate,
          };
        })
      )
    );
  }

  addTask(task: Partial<Task>, userId: string): Observable<Task> {
    const newTask = {
      ...task,
      userId,
      createdAt: new Date().toISOString(),
      completed: false,
    };
    return this.http.post<Task>(`${this.baseUrl}/tasks`, newTask);
  }

  updateTask(id: string, updates: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/tasks/${id}`, updates);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tasks/${id}`);
  }
}
