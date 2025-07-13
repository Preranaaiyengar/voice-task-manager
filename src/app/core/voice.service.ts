import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VoiceService {
  private recognition: any;

  constructor() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'en-US';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
  }

  listen(callback: (command: string) => void): void {
    this.recognition.start();

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      callback(transcript.toLowerCase());
    };

    this.recognition.onerror = (event: any) => {
      console.error('Voice recognition error:', event.error);
    };
  }
}
