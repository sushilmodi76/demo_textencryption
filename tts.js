class TextToSpeech {
    constructor() {
        this.synth = window.speechSynthesis;
        this.utterance = null;
    }

    speak(text) {
        if (this.synth.speaking) {
            this.synth.cancel();
        }

        if (text) {
            this.utterance = new SpeechSynthesisUtterance(text);
            this.utterance.voice = this.getBestVoice();
            this.synth.speak(this.utterance);
        }
    }

    getBestVoice() {
        const voices = this.synth.getVoices();
        return voices.find(v => v.lang === 'en-US') || voices[0];
    }
}

// Initialize TTS
const tts = new TextToSpeech();
document.getElementById('speakBtn').addEventListener('click', () => {
    const text = document.getElementById('output').textContent;
    if (text) {
        tts.speak(text);
    }
});