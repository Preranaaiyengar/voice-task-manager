import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { TaskService } from '../../../core/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../task.model';
import { Router } from '@angular/router';



@Component({
  selector: 'app-task-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task.page.component.html',
  styleUrls: ['./task.page.component.scss'],

})
export class TaskPageComponent implements OnInit, OnDestroy {
  taskText = '';
  tasks: Task[] = [];

  private voiceHandler!: (e: any) => void;
  private deleteHandler!: () => void;
  private markDoneHandler!: () => void;

  constructor(private taskService: TaskService, private cdr: ChangeDetectorRef, private router: Router) {}

  ngOnInit(): void {
    this.taskService.tasks$.subscribe((tasks) => {
      this.tasks = tasks;
      console.log('TASKS UPDATED FROM SUBSCRIPTION:', this.tasks);
    });

    this.voiceHandler = (e: any) => {
      this.taskText = e.detail;
      console.log('Voice Add Triggered:', this.taskText);
      this.addTask();
    };

    this.deleteHandler = () => {
      console.log('Voice Delete Triggered');
      if (this.tasks.length > 0) {
        const lastTask = this.tasks[this.tasks.length - 1];
        console.log('Deleting last task:', lastTask);
        this.delete(lastTask.id);
      } else {
        console.log('No tasks to delete');
      }
    };

    this.markDoneHandler = () => {
      if (this.tasks.length > 0) {
        const lastTask = this.tasks[this.tasks.length - 1];
        this.toggleDone(lastTask.id);
      }
    };

    window.addEventListener('add-voice-task', this.voiceHandler);
    window.addEventListener('delete-voice-task', this.deleteHandler);
    window.addEventListener('mark-done-voice-task', this.markDoneHandler);
  }

  ngOnDestroy(): void {
    window.removeEventListener('add-voice-task', this.voiceHandler);
    window.removeEventListener('delete-voice-task', this.deleteHandler);
    window.removeEventListener('mark-done-voice-task', this.markDoneHandler);

  }

  addTask() {
    if (this.taskText.trim()) {
      const task: Task = {
        id: 0,
        title: this.taskText,
        isDone: false,
        createdAt: new Date(),
      };
      console.log('Adding task:', task);
      this.taskService.addTask(task);
      this.taskText = '';
    }
  }

  toggleDone(id: number) {
    this.taskService.toggleTask(id);
  }

  delete(id: number) {
    console.log('Calling deleteTask with ID:', id);
    this.taskService.deleteTask(id);
  }

  goToDashboard() {
  this.router.navigate(['/dashboard']);
}

today = new Date();


}
