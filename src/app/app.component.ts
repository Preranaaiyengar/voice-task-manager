import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { VoiceService } from './core/voice.service';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private voiceService: VoiceService,  public router: Router) { }

  startVoice() {
    this.voiceService.listen((command: string) => {
      console.log('Command received:', command);

      if (command === 'delete last task') {
        const event = new CustomEvent('delete-voice-task');
        window.dispatchEvent(event);
        return; // ✅ Stop further execution
      }

      if (command.startsWith('add task')) {
        const taskText = command.replace('add task', '').trim();
        const event = new CustomEvent('add-voice-task', { detail: taskText });
        window.dispatchEvent(event);
        return;
      }

      if (command.includes('mark done')) {
        const event = new CustomEvent('mark-done-voice-task');
        window.dispatchEvent(event);
      }


      if (command.includes('dark mode')) {
        document.body.classList.toggle('dark-mode');
        
      }

      if (command.includes('light mode')) {
        document.body.classList.remove('dark-mode');
      }

      if (command.includes('go to dashboard')) {
        this.router.navigate(['/dashboard']);
        return;
      }
  
      if (command.includes('back to tasks')) {
        this.router.navigate(['/tasks']);
        return;
      }

      });

  }

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
    }
  }
  
  toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  get isDashboardPageComponent(): boolean {
    return this.router.url.includes('dashboard');
  }


  
}
