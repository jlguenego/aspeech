import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  getInterim(interimTranscript: string, transcript: string): string {
    return interimTranscript + transcript;
  }

  getFinal(finalTranscript: string, transcript: string): string {
    return finalTranscript + transcript;
  }
}
