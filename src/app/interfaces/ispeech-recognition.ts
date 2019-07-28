import { ISpeechEvent } from './ispeech-event';
import { ISpeechRecognitionError } from './ispeech-recognition-error';

export interface ISpeechRecognition {

  /**
   * when false, automatically stops after silence.
   *
   */
  continuous: boolean;
  /**
   * if true, then allow to the speech recognition to change its mind on a result.
   */
  interimResults: boolean;
  /**
   * language code
   * code BCP-47 (language-locale)
   */
  lang: string;

  /**
   * function that is run by the speech framework when starting to listen speech.
   */
  onstart: () => void;

  /**
   * function that is run by the speech framework when order to stop recognizing speech has been received.
   */
  onend: () => void;

  onresult: (event: ISpeechEvent) => void;
  onerror: (event: ISpeechRecognitionError) => void;


  /**
   * start listening for speech voice.
   */
  start(): void;

  /**
   * stop listening for speech voice.
   */
  stop(): void;



}
