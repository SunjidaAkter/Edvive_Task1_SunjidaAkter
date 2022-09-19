import './App.css'
import Translator from './Components/Translator';
import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useSpeechSynthesis } from 'react-speech-kit';

function App() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  const { speak } = useSpeechSynthesis();
  const [input, setInput] = useState('');
  const [sourceCode, setSourceCode] = useState('en');
  const [destCode, setDestCode] = useState('bn');
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);
  // const [utterance, setUtterance] = useState('');


  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }
  const translate = () => {
    console.log(transcript);
    let apiURL = `https://api.mymemory.translated.net/get?q=${transcript}&langpair=${sourceCode}|${destCode}`;
    setLoading(true);
    setTranslation('');
    fetch(apiURL).then((res) => res.json()).then((data) => {
      if (data.responseData.translatedText) {
        console.log(data.responseData.translatedText);
        setTranslation(data.responseData.translatedText);
        setLoading(false);
      } else {
        console.log("Sorry. Could not translate. Please try again");
        setTranslation("Sorry. Could not translate. Please try again")
        setLoading(false);
      }
    })

  }
  const start = () => {
    setTranslation('');
    SpeechRecognition.startListening();
  }
  const reset = () => {
    setTranslation('');
    resetTranscript();
  }
  let utterance;
  const speaks = () => {
    utterance = new SpeechSynthesisUtterance(translation);
    utterance.lang = destCode;
    speechSynthesis.speak(utterance);
  }


  return (
    <div className="App flex justify-center items-center" >
      <div className='py-24 '>
        <Translator />
        <div className='w-[100%]  justify-center items-center'>
          <div>
            <div className='flex items-center justify-start my-8'>

              {listening ? <img className='w-10' onClick={SpeechRecognition.stopListening} src="https://c.tenor.com/w63dY06lsp8AAAAi/mic.gif" alt="" /> : <img onClick={start} className="rounded-full w-10" src="https://cdn.iconscout.com/icon/premium/png-128-thumb/mic-off-1807714-1533766.png" alt="" />}
              {listening ? <p onClick={SpeechRecognition.stopListening} className='font-extrabold text-teal-900'>Microphone: On</p> : <p onClick={start} className='text-black font-bold'>Microphone: Off</p>}
            </div>
            {/* {listening ? <button className='block' onClick={SpeechRecognition.stopListening}>Stop</button> : <button className='block' onClick={start}>Start</button>} */}
            <div className='flex flex-col'>
              <textarea class="textarea textarea-info h-32" placeholder="Click the Microphone and Say Something ..." value={transcript} readOnly></textarea>
              <div className='flex items-center justify-start'>
                <img src="https://cdn-user-icons.flaticon.com/62988/62988607/1663558815799.svg?token=exp=1663559720~hmac=9e0f1ed0699d8679b3c9e6524db755e0" className='w-6 ' onClick={() => speak({ text: transcript })} alt="" />
                <p className='text-white font-bold text-base ' onClick={() => speak({ text: transcript })}>  Click Here to hear the pronunciation with patience</p>
              </div>
              {/* <button className='block btn-outline btn w-full text-white border-white ' onClick={() => speak({ text: transcript })}>Speak</button> */}
              <select className="select select-info select-bordered " value={destCode}
                onChange={(e) => setDestCode(e.target.value)}>
                <option >English</option>
              </select>
              <button className='block btn-outline btn w-full text-white border-white my-5' onClick={reset}>Reset</button>
            </div>
          </div>
          <div className='flex flex-col'>
            <textarea class="textarea textarea-info  h-32" placeholder="Translation" value={loading ? "Loading..." : translation} readOnly></textarea>
            <div className='flex items-center justify-start'>
              <img src="https://cdn-user-icons.flaticon.com/62988/62988607/1663558815799.svg?token=exp=1663559720~hmac=9e0f1ed0699d8679b3c9e6524db755e0" className='w-6' onClick={speaks} alt="" />
              <p className='text-white font-bold text-base' onClick={speaks}>  Click Here to hear the pronunciation with patience</p>
            </div>
            <select className="select select-info select-bordered " value={destCode}
              onChange={(e) => setDestCode(e.target.value)}>
              <option value="bn">Bengali</option>
              <option value="ar">Arabic</option>
              <option value="hi">Hindi</option>
              <option value="it">Italy</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
        </div>


        <div className='flex flex-col items-center justify-center '>
          <button className='block btn-outline btn text-white border-white w-full my-5' onClick={translate}>Translate</button>
        </div>

      </div>
    </div>
  );
}

export default App;
