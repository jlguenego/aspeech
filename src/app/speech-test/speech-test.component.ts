import { Component, OnInit, NgZone, ApplicationRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IWindow } from '../interfaces/iwindow';
import { ISpeechRecognition } from '../interfaces/ispeech-recognition';
import { ISpeechEvent } from '../interfaces/ispeech-event';

@Component({
  selector: 'app-speech-test',
  templateUrl: './speech-test.component.html',
  styleUrls: ['./speech-test.component.scss']
})
export class SpeechTestComponent implements OnInit {

  MESSAGES = {
    initial: 0,
    listening: 1,
    listeningOngoing: 2,
    noSpeechError: 3,
    unknownError: 4,
    networkError: 5,
  };

  recognition: ISpeechRecognition;

  countries = [
    { label: 'Français', code: 'fr-FR' },
    { label: 'Română', code: 'ro-RO' },
    { label: 'English', code: 'en-NZ' },
  ];

  dialect = new FormControl('fr-FR');

  interimTranscript = '';
  finalTranscript = '';
  message = this.MESSAGES.initial;

  isStarted = false;
  isListening = false;
  ignoreOnEnd = false;

  constructor(private app: ApplicationRef) { }

  ngOnInit() {
    const { webkitSpeechRecognition }: IWindow = window as IWindow;
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;

    this.recognition.onstart = () => {
      console.log('onstart');
      this.isListening = true;
      this.message = this.MESSAGES.listening;
      this.app.tick();
    };
    this.recognition.onresult = (event: ISpeechEvent) => {
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
