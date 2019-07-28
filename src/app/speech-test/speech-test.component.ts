import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IWindow } from '../interfaces/iwindow';
import { ISpeechRecognition } from '../interfaces/ispeech-recognition';

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

  constructor() { }

  ngOnInit() {
    const { webkitSpeechRecognition }: IWindow = window as IWindow;
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;

    // recognition.onstart = function () { ... }
    // recognition.onresult = function (event) { ... }
    // recognition.onerror = function (event) { ... }
    // recognition.onend = function () { ... }
  }

  toggleContinuous() {
    this.recognition.continuous = !this.recognition.continuous;
  }

  toggleInterimResults() {
    this.recognition.interimResults = !this.recognition.interimResults;
  }

  start() {

    if (this.recognizing) {
      this.recognition.stop();
      console.log('stop');
      return;
    }
    console.log('start');
    // final_transcript = '';
    this.recognition.lang = this.dialect.value;
    this.recognition.start();
    // ignore_onend = false;
    // final_span.innerHTML = '';
    // interim_span.innerHTML = '';
    // start_img.src = 'mic-slash.gif';
    // showInfo('info_allow');
    // showButtons('none');
    // start_timestamp = event.timeStamp;
  }

}
