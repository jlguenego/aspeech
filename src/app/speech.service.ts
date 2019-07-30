import { Injectable } from '@angular/core';
import { Command, commands } from './command';

const trimSpace = (str: string): string => {
  let result = str;
  while (result.substring(0, 1) === ' ') {
    result = result.substring(1);
  }
  while (result.substring(result.length - 1) === ' ') {
    result = result.substring(0, result.length - 1);
  }
  return result;
};

@Injectable({
  providedIn: 'root'
})
export class SpeechService {

  command: Command;
  finalTranscript: string;
  transcript: string;
  lang = 'fr_FR';
  speechRecognition: SpeechRecognition;

  getInterim(interimTranscript: string, transcript: string, isLast: boolean): string {
    console.log('isLast', isLast);
    this.command = undefined;
    if (isLast) {
      this.checkInterimCommand(transcript);
    }

    return interimTranscript + transcript;
  }

  getFinal(finalTranscript: string, transcript: string): string {
    console.log('getFinal: finalTranscript', finalTranscript);
    this.finalTranscript = finalTranscript;
    this.transcript = transcript;
    if (this.command) {
      console.log('we have a interim command');
      const result = this.command.fn(this);
      this.command = undefined;
      return result;
    }
    this.checkFinalCommand(transcript);
    if (this.command) {
      console.log('we have a final command');
      const result = this.command.fn(this);
      this.command = undefined;
      return result;
    }
    return finalTranscript + transcript;
  }

  checkInterimCommand(transcript: string) {
    // tslint:disable-next-line: forin
    for (const p in commands) {
      if (!commands[p].interim) {
        continue;
      }
      console.log(`transcript=|${transcript.trim()}|`);
      console.log(`commands[p].interim=|${commands[p].interim[this.lang.substring(0, 2)]}|`);
      if (transcript.trim() === commands[p].interim[this.lang.substring(0, 2)]) {
        console.log('setting command', commands[p]);
        this.command = commands[p];
        return;
      }
    }
    this.command = undefined;
    return;
  }

  checkFinalCommand(transcript: string) {
    // tslint:disable-next-line: forin
    for (const p in commands) {
      if (!commands[p].final) {
        continue;
      }
      const pattern = commands[p].final[this.lang.substring(0, 2)];
      if (typeof pattern === 'string') {
        console.log(`final trimSpace(transcript)=|${trimSpace(transcript)}|`);
        console.log(`final commands[p].final=|${pattern}|`);
        if (trimSpace(transcript) === pattern) {
          console.log('setting command', commands[p]);
          this.command = commands[p];
          return;
        }
      }
      if (pattern instanceof RegExp) {
        console.log('regexp !!!');
        console.log(`final trimSpace(transcript)=|${trimSpace(transcript)}|`);
        console.log(`pattern=${pattern}`);
        if (trimSpace(transcript).match(pattern)) {
          console.log('setting command', commands[p]);
          this.command = commands[p];
          return;
        }
      }
    }
    this.command = undefined;
    return;
  }
}
