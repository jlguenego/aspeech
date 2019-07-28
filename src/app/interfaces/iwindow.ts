import { ISpeechRecognition } from './ispeech-recognition';

export interface IWindow extends Window {
  webkitSpeechRecognition: new () => ISpeechRecognition;
}


