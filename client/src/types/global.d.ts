/**
 * Global type declarations for browser APIs not included in TypeScript by default
 */

interface Window {
  /**
   * The SpeechRecognition interface of the Web Speech API is the main controller interface for the recognition service
   */
  SpeechRecognition?: typeof SpeechRecognition;
  
  /**
   * Webkit prefixed version of SpeechRecognition
   */
  webkitSpeechRecognition?: typeof SpeechRecognition;
}

/**
 * The SpeechRecognition interface of the Web Speech API
 */
declare class SpeechRecognition extends EventTarget {
  continuous: boolean;
  grammars: any;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: Event) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  
  abort(): void;
  start(): void;
  stop(): void;
}