export const tts = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
}

export const sr = async (): Promise<string> => {
    if (typeof window === 'undefined' || (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window))) return;
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
        console.log('Voice activated');
    }

    recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        resolve(result);
    }

    recognition.onend = () => {
        console.log('Voice deactivated');
    }

    recognition.onerror = (event) => {
        console.log(event.error);
    }
    
    recognition.start();

}