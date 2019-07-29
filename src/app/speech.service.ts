import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {

  command: string;

  getInterim(interimTranscript: string, transcript: string, isLast: boolean): string {
    // if (transcript === '.') {

    // }
    return interimTranscript + transcript;
  }

  getFinal(finalTranscript: string, transcript: string): string {
    return finalTranscript + transcript;
  }
}
