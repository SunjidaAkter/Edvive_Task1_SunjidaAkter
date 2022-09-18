import Translator from './Components/Translator';
import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './App.css'

import axios from 'axios';



function App() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  const [input, setInput] = useState('');
  const [sourceCode, setSourceCode] = useState('en');
  const [destCode, setDestCode] = useState('bn');
  const [language, setLanguage] = useState('');
  const [loading, setLoading] = useState(false);


  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }
  // useEffect(() => {
  //   alanBtn({
  //     key: '6110b70aeb749fe2f2651d9b7d27e3d22e956eca572e1d8b807a3e2338fdd0dc/stage',
  //     onCommand: (commandData) => {
  //       console.log(commandData);
  //       if (commandData.command === 'input') {
  //         // setInput(commandData.data)
  //       }
  //       if (commandData.command === 'source') {
  //         if (commandData.data === 'English') {
  //           // setSourceCode('en')
  //         }
  //       }
  //       if (commandData.command === 'destination') {
  //         if (commandData.data === 'Bangla') {
  //           // setDestCode('bn')
  //         }
  //         // if (commandData.command === 'Spanish') {
  //         //   setDestCode('ES')
  //         // }
  //       }
  //     }
  //   });
  // }, []);
  // setInput('I am eating rice')
  // setSourceCode('en')
  // setDestCode('bn')
  const translate = () => {
    console.log(transcript);
    let apiURL = `https://api.mymemory.translated.net/get?q=${transcript}&langpair=${sourceCode}|${destCode}`;
    setLoading(true);
    fetch(apiURL).then((res) => res.json()).then((data) => {
      if (data.responseData.translatedText) {
        console.log(data.responseData.translatedText);
        setLanguage(data.responseData.translatedText);
        setLoading(false);
      } else {
        console.log("sorry");
        setLanguage("sorry")
        setLoading(false);
      }
    })

  }
  const start = () => {
    setLanguage('');
    SpeechRecognition.startListening();
  }
  const reset = () => {
    setLanguage('');
    resetTranscript();
  }

  return (
    <div className="App">
      {/* <Translator /> */}
      <button onClick={translate}>Translate</button>
      <div>
        <p>Microphone: {listening ? 'on' : 'off'}</p>
        {listening ? <button onClick={SpeechRecognition.stopListening}>Stop</button> : <button onClick={start}>Start</button>}
        {/* <button onClick={SpeechRecognition.stopListening}>Stop</button> */}
        <button onClick={reset}>Reset</button>
        <p>{transcript}</p>
        <p>Translated below</p>
        {loading && <p>Loading...</p>}
        <p>{language}</p>
      </div>
    </div>
  );
}

export default App;
