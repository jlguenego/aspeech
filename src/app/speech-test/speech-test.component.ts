import { Component, OnInit, NgZone, ApplicationRef, HostListener } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IWindow } from '../interfaces/iwindow';

@Component({
  selector: 'app-speech-test',
  templateUrl: './speech-test.component.html',
  styleUrls: ['./speech-test.component.scss']
})
export class SpeechTestComponent implements OnInit {

  canWork = true;

  MESSAGES = {
    initial: 10,
    listening: 11,
    noSpeechError: 13,
    unknownError: 14,
    networkError: 15,
    notAllowedError: 12,
  };

  recognition: SpeechRecognition;

  countries = [
    { label: 'Français', code: 'fr-FR' },
    { label: 'Română', code: 'ro-RO' },
    { label: 'English', code: 'en-NZ' },
    { label: 'Klingon', code: '' },
  ];

  dialect = new FormControl('fr-FR');

  interimTranscript = '';
  finalTranscript = '';
  message = this.MESSAGES.initial;
  error = '';

  isStarted = false;
  isListening = false;
  ignoreOnEnd = false;

  confidenceLevel = 0;

  constructor(private app: ApplicationRef) { }

  ngOnInit() {
    if (!('webkitSpeechRecognition' in window)) {
      this.canWork = false;
      return;
    }
    const { webkitSpeechRecognition }: IWindow = window as IWindow;
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = this.dialect.value;
    console.log('this.recognition', this.recognition);

    this.recognition.onstart = (event: Event) => {
      console.log('onstart', event);
      this.isListening = true;
      this.message = this.MESSAGES.listening;
      this.app.tick();
    };
    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      console.log('on result', event);
      this.interimTranscript = '';
      const results: SpeechRecognitionResultList = event.results;
      for (let i = event.resultIndex; i < results.length; ++i) {
        const result: SpeechRecognitionResult = results[i];
        // settings with only 1 alternative.
        const alternative: SpeechRecognitionAlternative = result[0];
        this.confidenceLevel = alternative.confidence * 100;
        if (result.isFinal) {
          this.finalTranscript += alternative.transcript;
          console.log('this.finalTranscript', i, this.finalTranscript, alternative.confidence);
        } else {
          this.interimTranscript += alternative.transcript;
          console.log('this.interimTranscript', i, this.interimTranscript, '|confidence:', alternative.confidence);
        }
      }
      this.app.tick();

    };
    this.recognition.onerror = (event) => {
      console.error('error', event);
      const map = {
        'no-speech': this.MESSAGES.noSpeechError,
        network: this.MESSAGES.networkError,
        'not-allowed': this.MESSAGES.notAllowedError,
      };
      this.message = map[event.error] || this.MESSAGES.unknownError;
      this.ignoreOnEnd = true;
      this.app.tick();
    };

    this.recognition.onend = () => {
      console.log('onend');
      this.isListening = false;
      this.isStarted = false;
      this.isListening = false;
      if (this.ignoreOnEnd) {
        this.app.tick();
        return;
      }
      this.message = this.MESSAGES.initial;
      this.app.tick();
    };
  }

  @HostListener('document:keypress', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.key !== ' ') {
      return;
    }
    if (this.isStarted) {
      return;
    }
    console.log('space press');
    console.log('space press will start');
    this.start();
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyup(event: KeyboardEvent) {
    if (event.key !== ' ') {
      return;
    }
    console.log('space up');
    this.stop();
    console.log('end space up');
  }

  toggleContinuous() {
    this.recognition.continuous = !this.recognition.continuous;
  }

  toggleInterimResults() {
    this.recognition.interimResults = !this.recognition.interimResults;
  }

  toggleMicrophone() {
    if (this.isStarted) {
      this.stop();
      return;
    }
    console.log('toggle will start');
    this.start();
  }

  stop() {
    this.recognition.stop();
    console.log('order stop sent');
  }

  start() {
    console.log('start');
    this.isStarted = true;
    this.ignoreOnEnd = false;
    this.finalTranscript = '';
    this.recognition.lang = this.dialect.value;
    this.recognition.start();
  }

}
