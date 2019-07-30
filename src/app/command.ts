import { SpeechService } from './speech.service';

export interface Command {
  name: string;
  interim?: { [lang: string]: string | RegExp };
  final?: { [lang: string]: string | RegExp };
  fn: (service: SpeechService) => string;
}

export const commands: { [key: string]: Command; } = {
  REMOVE_ALL: {
    name: 'removeAll',
    interim: {
      fr: 'efface tout',
      en: 'remove all'
    },
    fn: () => ''
  },
  REMOVE: {
    name: 'remove',
    interim: {
      fr: 'efface',
      en: 'remove'
    },
    fn: (service: SpeechService) => service.finalTranscript.replace(/^(.*)\s+\S+\s*$/, '$1')
  },
  NEWLINE: {
    name: 'newline',
    final: {
      fr: '\n',
      en: '\n'
    },
    fn: (service: SpeechService) => service.finalTranscript + '<br>'
  },
  NEWLINE2: {
    name: 'newline',
    final: {
      fr: 'à la ligne',
    },
    fn: (service: SpeechService) => service.finalTranscript + '<br>'
  },
  STOP: {
    name: 'stop',
    final: {
      fr: 'stop',
      en: 'stop'
    },
    fn: (service: SpeechService) => {
      service.speechRecognition.stop();
      return service.finalTranscript;
    }
  },
  JACADI: {
    name: 'jacadi',
    final: {
      fr: /^Jacadi/,
      en: /^Jacadi/,
    },
    fn: (service: SpeechService) => {
      console.log('executing JACADI');
      // execute the command with the rest of the transcript.
      const commandPattern = service.transcript.trim().replace(/^Jacadi( .*)?$/, '$1');
      console.log('service.transcript', service.transcript);
      console.log('commandPattern', commandPattern);
      service.transcript = commandPattern;
      service.command = undefined;
      service.checkInterimCommand(commandPattern);
      if (service.command && service.command.name === 'jacadi') {
        throw new Error('should not happen!');
      }
      if (service.command && service.command.name !== 'jacadi') {
        console.log('command found (interim)');
        const result = service.command.fn(service);
        service.command = undefined;
        return result;
      }
      service.checkFinalCommand(commandPattern);
      if (service.command && service.command.name === 'jacadi') {
        throw new Error('should not happen!');
      }
      if (service.command && service.command.name !== 'jacadi') {
        console.log('command found (final)');
        const result = service.command.fn(service);
        service.command = undefined;
        return result;
      }
      return service.finalTranscript;
    }
  }
};
