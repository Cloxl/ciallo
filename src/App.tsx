import React from 'react';
import './App.css';
import AudioPlayer from './components/AudioPlayer'
import {AudioProvider} from "./components/AudioContext"
import {SettingsModal} from "./components/SettingsModal"

function App() {
    return (
        <AudioProvider>
            <AudioPlayer/>
        </AudioProvider>
    );
}

export default App;
