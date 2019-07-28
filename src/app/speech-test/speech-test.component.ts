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

  recognition: ISpeechRecognition;

  countries = [
    { label: 'Français', code: 'fr-FR' },
    { label: 'Română', code: 'ro-RO' },
    { label: 'English', code: 'en-NZ' },
  ];

  dialect = new FormControl('fr-FR');

  interimTranscript = '';
  finalTranscript = '';

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
      this.app.tick();
    };
    this.recognition.onresult = (event: ISpeechEvent) => {
      console.log('on result', event);
      this.interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          this.finalTranscript += event.results[i][0].transcript;
          console.log('this.finalTranscript', this.finalTranscript);
          this.app.tick();

        } else {
          this.interimTranscript += event.results[i][0].transcript;
          console.log('this.interimTranscript', this.interimTranscript);
          this.app.tick();
        }
      }

    };
    this.recognition.onerror = (event) => {
      console.error('error', event);
      this.app.tick();
    };

    this.recognition.onend = () => {
      console.log('onend');
      this.isListening = false;
      if (this.ignoreOnEnd) {
        return;
      }
      this.isStarted = false;
      this.isListening = false;
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
