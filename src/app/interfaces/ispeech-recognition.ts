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
   * start listening for speech voice.
   */
  start(): void;

  /**
   * stop listening for speech voice.
   */
  stop(): void;

}
