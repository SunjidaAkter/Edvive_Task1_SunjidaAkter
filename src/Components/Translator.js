import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useSpeechSynthesis } from 'react-speech-kit';
import { SpeakerWaveIcon } from '@heroicons/react/24/solid'

const Translator = () => {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const { speak } = useSpeechSynthesis();

    //----------------------------declaring states--------------------------------//
    const [input, setInput] = useState('');
    const [sourceCode, setSourceCode] = useState('en');
    const [destCode, setDestCode] = useState('bn');
    const [translation, setTranslation] = useState('');
    const [loading, setLoading] = useState(false);

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }


    // ----------translating function--------------//
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
    const speaks = () => {
        let utterance;
        utterance = new SpeechSynthesisUtterance(translation);
        console.log(utterance)
        utterance.lang = destCode;
        console.log(utterance.lang)
        speechSynthesis.speak(utterance);
    }


    return (
        <div>
            <div className='py-24 '>
                <p className='text-white font-extrabold text-5xl'>Voice Translator</p>

                {/*------------------ Transcripting part--------------------- */}
                <div>
                    {listening ?
                        <div className='flex items-center justify-start my-8'>
                            <img className='w-10' onClick={SpeechRecognition.stopListening} src="https://c.tenor.com/w63dY06lsp8AAAAi/mic.gif" alt="on mic" />
                            <p onClick={SpeechRecognition.stopListening} className='font-extrabold text-teal-900'>Microphone: On</p>
                        </div>
                        :
                        <div className='flex items-center justify-start my-8'>
                            <img onClick={start} className="rounded-full w-10" src="https://cdn.iconscout.com/icon/premium/png-128-thumb/mic-off-1807714-1533766.png" alt="off mic" />
                            <p onClick={start} className='text-black font-bold'>Microphone: Off</p>
                        </div>
                    }
                    <div className='flex flex-col'>
                        <textarea className="textarea textarea-info h-32" placeholder="Click the Microphone and Say Something ..." value={transcript} readOnly></textarea>
                        <div className='flex items-center justify-start'>
                            <SpeakerWaveIcon className="h-6 w-6 text-white" onClick={() => speak({ text: transcript })} />
                            <p className='text-white font-bold text-base ' onClick={() => speak({ text: transcript })}>  Click Here to hear the pronunciation with patience</p>
                        </div>
                        <select className="select select-info select-bordered " value={destCode}
                            onChange={(e) => setDestCode(e.target.value)}>
                            <option >English</option>
                        </select>
                        <button className='block btn-outline btn w-full text-white border-white my-5' onClick={reset}>Reset</button>
                    </div>
                </div>

                {/* -------------------TRanslation Part-------------------- */}
                <div className='flex flex-col'>
                    <textarea className="textarea textarea-info  h-32" placeholder="Translation" value={loading ? "Translating..." : translation} readOnly></textarea>
                    <div className='flex items-center justify-start'>
                        <SpeakerWaveIcon onClick={speaks} className="h-6 w-6 text-white" />
                        <p className='text-white font-bold text-base' onClick={speaks}>  Click Here to hear the pronunciation with patience</p>
                    </div>
                    <select className="select select-info select-bordered " value={destCode}
                        onChange={(e) => setDestCode(e.target.value)}>
                        <option value="bn">Bengali</option>
                        <option value="ar">Arabic</option>
                        <option value="tr">Turkish</option>
                        <option value="ur">Urdu</option>
                        <option value="hi">Hindi</option>
                        <option value="it">Italy</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="zh">Chinese</option>
                        <option value="ja">Japanese</option>
                        <option value="ko">Korean</option>
                        <option value="ru">Russian</option>
                    </select>
                </div>
                <div className='flex flex-col items-center justify-center '>
                    <button className='block btn-outline btn text-white border-white w-full my-5' onClick={translate}>Translate</button>
                </div>
            </div>

        </div>
    );
};

export default Translator;