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

  recognizing = false;
  dialect = new FormControl('fr-FR');

  interimTranscript = '';
  finalTranscript = '';

  constructor(private app: ApplicationRef) { }

  ngOnInit() {
    const { webkitSpeechRecognition }: IWindow = window as IWindow;
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;

    this.recognition.onstart = () => {
      console.log('onstart');
      this.recognizing = true;
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
    // recognition.onerror = function (event) { ... }
    // recognition.onend = function () { ... }
  }

  toggleContinuous() {
    this.recognition.continuous = !this.recognition.continuous;
  }

  toggleInterimResults() {
    this.recognition.interimResults = !this.recognition.interimResults;
  }



  toggleMicrophone() {

    if (this.recognizing) {
      this.recognition.stop();
      console.log('stop');
      return;
    }
    console.log('start');
    this.finalTranscript = '';
    this.recognition.lang = this.dialect.value;
    this.recognition.start();
    // ignore_onend = false;

    // start_img.src = 'mic-slash.gif';
    // showInfo('info_allow');
    // showButtons('none');
    // start_timestamp = event.timeStamp;
  }

}
