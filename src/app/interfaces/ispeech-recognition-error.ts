import { ISpeechEvent } from './ispeech-event';

export interface ISpeechRecognitionError extends ISpeechEvent {
  error: string;
}
