import { useState, useRef, useEffect, useCallback } from 'react';
import { UseDictationReturn } from '../types';

/**
 * Custom hook for managing speech recognition and dictation functionality
 * 
 * Note: We use 'any' types for the Web Speech API because it's not fully
 * supported in TypeScript's standard library. In a production environment,
 * you might want to use a proper type definition package.
 * 
 * @param dictationText - Current dictation text
 * @param setDictationText - Function to update dictation text
 * @returns Object containing dictation state and handlers
 */
export const useDictation = (
  dictationText: string,
  setDictationText: (text: string) => void
): UseDictationReturn => {
  // State for tracking recording status
  const [isRecording, setIsRecording] = useState(false);
  
  // State for tracking if speech recognition is supported
  const [isSupported, setIsSupported] = useState(false);
  
  // Ref to store the SpeechRecognition instance
  const recognitionRef = useRef<any>(null);
  
  // Ref to store the final transcript
  const finalTranscriptRef = useRef(dictationText);

  // Initialize speech recognition
  useEffect(() => {
    // Store the current dictation text in the ref
    finalTranscriptRef.current = dictationText;

    // Check if speech recognition is supported
    // Using 'any' type because the Web Speech API is not fully supported in TypeScript
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      
      // Configure recognition
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      // Set up event handlers
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = finalTranscriptRef.current || '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += ' ' + transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Update the final transcript ref
        finalTranscriptRef.current = finalTranscript;
        
        // Update the dictation text with both final and interim results
        setDictationText((finalTranscript + ' ' + interimTranscript).trim());
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };
      
      recognition.onend = () => {
        if (isRecording) {
          // Restart if we're still supposed to be recording
          recognition.start();
        }
      };
      
      // Store the recognition instance in the ref
      recognitionRef.current = recognition;
    }
    
    // Cleanup function
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        if (isRecording) {
          try {
            recognitionRef.current.stop();
          } catch (e) {
            console.error('Error stopping recognition', e);
          }
        }
      }
    };
  }, [dictationText, isRecording, setDictationText]);

  // Toggle recording state
  const toggleRecording = useCallback(() => {
    if (!recognitionRef.current) return;
    
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error('Error starting recognition', e);
      }
    }
    
    setIsRecording(prev => !prev);
  }, [isRecording]);

  // Clear dictation text
  const clearDictation = useCallback(() => {
    setDictationText('');
    finalTranscriptRef.current = '';
  }, [setDictationText]);

  return {
    isRecording,
    toggleRecording,
    clearDictation,
    isSupported
  };
};