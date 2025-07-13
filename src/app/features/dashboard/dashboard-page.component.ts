import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { Router } from '@angular/router';
import { TaskService } from '../../core/task.service';
import { Task } from '../tasks/task.model';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {
  chartType: ChartType = 'bar';
  chartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [],
  };

  lightChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#333333' // dark text for light background
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#333333' },
        grid: { color: '#cccccc' }
      },
      y: {
        ticks: { color: '#333333' },
        grid: { color: '#cccccc' }
      }
    }
  };
  
  darkChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#ffffff' // white text for dark background
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#ffffff' },
        grid: { color: '#444444' }
      },
      y: {
        ticks: { color: '#ffffff' },
        grid: { color: '#444444' }
      }
    }
  };
  
  motivation = ''; // use regular string

  chartOptions: any;  // dynamic assignment

constructor(private taskService: TaskService, private router: Router) {}

ngOnInit(): void {
  this.taskService.tasks$.subscribe((tasks: Task[]) => {
    const summary = this.getWeeklySummary(tasks);
    this.chartData = this.createChartData(summary);
    this.motivation = this.getMotivationMessage(summary);
  });

  // Set chart options based on current theme
  const isDark = document.body.classList.contains('dark-mode');
  this.chartOptions = isDark ? this.darkChartOptions : this.lightChartOptions;
}

ngAfterViewInit() {
  const observer = new MutationObserver(() => {
    const isDark = document.body.classList.contains('dark-mode');
    this.chartOptions = isDark ? this.darkChartOptions : this.lightChartOptions;
  });

  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
}



  getWeeklySummary(tasks: Task[]) {
    const summaryMap: Record<string, { completed: number; pending: number }> = {};

    tasks.forEach(task => {
      const date = new Date(task.createdAt).toLocaleDateString('en-IN', { weekday: 'short' });
      if (!summaryMap[date]) summaryMap[date] = { completed: 0, pending: 0 };
      if (task.isDone) summaryMap[date].completed++;
      else summaryMap[date].pending++;
    });

    const order = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return order.map(day => ({
      date: day,
      completed: summaryMap[day]?.completed || 0,
      pending: summaryMap[day]?.pending || 0,
    }));
  }

  createChartData(summary: { date: string; completed: number; pending: number }[]) {
    return {
      labels: summary.map(s => s.date),
      datasets: [
        {
          label: 'Completed',
          data: summary.map(s => s.completed),
          backgroundColor: '#4CAF50',
        },
        {
          label: 'Pending',
          data: summary.map(s => s.pending),
          backgroundColor: '#F44336',
        },
      ],
    };
  }

  getMotivationMessage(summary: { completed: number; pending: number }[]): string {
    const total = summary.reduce((a, b) => a + b.completed + b.pending, 0);
    const done = summary.reduce((a, b) => a + b.completed, 0);
    const percentage = total > 0 ? (done / total) * 100 : 0;

    if (percentage === 100) return '🏆 Task Master';
    if (percentage >= 70) return '💪 Almost There!';
    if (percentage >= 30) return '✨ Try to Finish More!';
    return '😴 Let’s do better next week!';
  }
  goToTask(){
    this.router.navigate(['/tasks']);
  }
}
  
  
