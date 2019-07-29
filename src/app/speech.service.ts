import { Injectable } from '@angular/core';

interface Command {
  text: string;
  fn: (finalTranscript: string) => string;
}

const commands: { [key: string]: Command; } = {
  ERASE_ALL: {
    text: 'efface tout',
    fn: (finalTranscript) => ''
  },
  ERASE: {
    text: 'efface',
    fn: (finalTranscript) => finalTranscript.replace(/^(.*)\s+\S+\s*$/, '$1')
  },
};

@Injectable({
  providedIn: 'root'
})
export class SpeechService {

  command: Command;

  getInterim(interimTranscript: string, transcript: string, isLast: boolean): string {
    console.log('isLast', isLast);
    if (isLast) {
      // tslint:disable-next-line: forin
      for (const p in commands) {
        console.log(`transcript=|${transcript.trim()}|`);
        console.log(`commands[p].text=|${commands[p].text}|`);
        if (transcript.trim() === commands[p].text) {
          console.log('setting command', commands[p]);
          this.command = commands[p];
          return interimTranscript + transcript;
        }
      }
    }
    this.command = undefined;
    return interimTranscript + transcript;
  }

  getFinal(finalTranscript: string, transcript: string): string {
    console.log('getFinal: finalTranscript', finalTranscript);
    if (this.command) {
      console.log('we have a command');
      const result = this.command.fn(finalTranscript);
      this.command = undefined;
      return result;
    }
    return finalTranscript + transcript;
  }
}
