import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../features/tasks/task.model';
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: Task[] = [];
  private taskSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.taskSubject.asObservable();

  constructor() {}

  addTask(task: Task) {
    task.id = Date.now(); // unique ID
    this.tasks.push(task);
    this.taskSubject.next([...this.tasks]); // spread to trigger change detection
    createdAt: new Date()

  }

  deleteTask(id: number) {
    console.log('Inside TaskService: deleting ID', id);
    this.tasks = this.tasks.filter((t) => t.id !== id);
    console.log('Updated tasks:', this.tasks);
    this.taskSubject.next([...this.tasks]); // spread again to force change detection
  }

  toggleTask(id: number) {
    this.tasks = this.tasks.map((t) =>
      t.id === id ? { ...t, isDone: !t.isDone } : t
    );
    this.taskSubject.next([...this.tasks]);
  }

  getWeeklySummary() {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 6);
  
    const summary = Array(7).fill(0).map((_, i) => {
      const day = new Date(sevenDaysAgo);
      day.setDate(sevenDaysAgo.getDate() + i);
      const dateStr = day.toDateString();
  
      const tasksForDay = this.tasks.filter(task =>
        new Date(task.createdAt).toDateString() === dateStr
      );
  
      const completed = tasksForDay.filter(t => t.isDone).length;
      const pending = tasksForDay.filter(t => !t.isDone).length;
  
      return {
        date: dateStr,
        completed,
        pending
      };
    });
  
    return summary;
  }
  
}
