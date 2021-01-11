import ClapDetector from 'clap-detector';
import apiClient from './api_client';


const clapDetector = new ClapDetector()

const disposableOneClapListener = clapDetector.addClapsListener(claps => {
  console.log("Double clap");
  apiClient.post('toggle-power');
}, { number: 2, delay: 1000 })

var SpeechRecognition = SpeechRecognition;
