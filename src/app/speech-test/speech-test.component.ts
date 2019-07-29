import { Component, OnInit, NgZone, ApplicationRef } from '@angular/core';
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
    initial: 0,
    listening: 1,
    listeningOngoing: 2,
    noSpeechError: 3,
    unknownError: 4,
    networkError: 5,
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
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          this.finalTranscript += event.results[i][0].transcript;
          console.log('this.finalTranscript', this.finalTranscript);
        } else {
          this.interimTranscript += event.results[i][0].transcript;
          console.log('this.interimTranscript', this.interimTranscript);
        }
      }
      this.message = this.MESSAGES.listeningOngoing;
      this.app.tick();

    };
    this.recognition.onerror = (error) => {
      console.error('error', error);
      if (error.error === 'no-speech') {
        this.message = this.MESSAGES.noSpeechError;
      } else if (error.error === 'network') {
        this.message = this.MESSAGES.networkError;
      } else {
        this.message = this.MESSAGES.unknownError;
        this.error = error.error;
      }
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

  toggleContinuous() {
    this.recognition.continuous = !this.recognition.continuous;
  }

  toggleInterimResults() {
    this.recognition.interimResults = !this.recognition.interimResults;
  }

  toggleMicrophone() {
    if (this.isStarted) {
      this.recognition.stop();
      console.log('stop');
      this.isStarted = false;
      return;
    }

    console.log('start');
    this.isStarted = true;
    this.ignoreOnEnd = false;
    this.finalTranscript = '';
    this.recognition.lang = this.dialect.value;
    this.recognition.start();
  }

}
