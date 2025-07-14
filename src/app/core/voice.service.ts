import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VoiceService {
  private recognition: any;
  private isListening = false;
  private callbackFn?: (command: string) => void; 

  constructor() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'en-US';
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      this.callbackFn?.(transcript.toLowerCase()); 
    };

    this.recognition.onerror = (event: any) => {
      console.error('Voice recognition error:', event.error);
    };

    this.recognition.onend = () => {
      if (this.isListening) {
        this.recognition.start();
      }
    };
  }

  listen(callback: (command: string) => void): void {
    this.callbackFn = callback;
    this.isListening = true;
    this.recognition.start();
  }

  stop(): void {
    this.isListening = false;
    this.recognition.stop();
  }
}
