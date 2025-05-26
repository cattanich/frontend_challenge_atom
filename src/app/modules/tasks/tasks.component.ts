import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService, Task } from '../../services/task.service';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  taskForm: FormGroup;
  editingTaskId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit() {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      console.warn('Usuario logueado no definido en localStorage');
    } else {
      console.log('Usuario logueado:', userEmail);
    }
    this.loadTasks();
  }

  loadTasks() {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      console.warn('No hay usuario autenticado');
      this.tasks = [];
      return;
    }
    this.taskService.getTasks(userEmail).subscribe((tasks: Task[]) => {
      console.log('Tareas recibidas:', tasks);
      tasks.forEach(task => {
        console.log('createdAt de tarea:', task.createdAt);
      });
      this.tasks = tasks
        .filter(task => task.userId === userEmail)
        .sort((a: Task, b: Task) => {
          const dateA = a.createdAt ? Date.parse(a.createdAt.toString()) : 0;
          const dateB = b.createdAt ? Date.parse(b.createdAt.toString()) : 0;
          return dateA - dateB;
        });
    });
  }

  trackByUserId(index: number, task: Task): string {
    return task.userId || task.id;
  }

  onSubmit() {
    if (this.taskForm.invalid) {
      return;
    }
    const { title, description } = this.taskForm.value;
    let userId = localStorage.getItem('userId'); // Corregido para usar userId en lugar de userEmail
    if (!userId) {
      console.warn('userId no definido en localStorage, asignando valor por defecto');
      userId = 'default-user-id';
    }
    if (this.editingTaskId) {
      this.taskService.updateTask(this.editingTaskId, { title, description }).subscribe(() => {
        this.loadTasks();
        this.cancelEdit();
      });
    } else {
      this.taskService.addTask({ title, description }, userId).subscribe(() => {
        this.loadTasks();
        this.taskForm.reset();
      });
    }
  }

  toggleCompleted(task: Task) {
    this.taskService.updateTask(task.id, { completed: !task.completed }).subscribe(() => {
      this.loadTasks();
    });
  }

  editTask(task: Task) {
    this.editingTaskId = task.id;
    this.taskForm.setValue({
      title: task.title,
      description: task.description || '',
    });
  }

  cancelEdit() {
    this.editingTaskId = null;
    this.taskForm.reset();
  }

  deleteTask(task: Task) {
    this.taskService.deleteTask(task.id).subscribe(() => {
      this.loadTasks();
    });
  }

  logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    this.router.navigate(['/login']);
  }
}
