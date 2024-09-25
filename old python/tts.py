from transformers import VitsModel, AutoTokenizer
import torch
import numpy as np
from pydub import AudioSegment
import simpleaudio as sa
import threading

model = VitsModel.from_pretrained("facebook/mms-tts-eng")
tokenizer = AutoTokenizer.from_pretrained("facebook/mms-tts-eng")

is_tts_playing = False

def play_sound(audio_segment):
    play_obj = sa.play_buffer(
        audio_segment.raw_data, 
        num_channels = 1, 
        bytes_per_sample = audio_segment.sample_width, 
        sample_rate = audio_segment.frame_rate
    )
    play_obj.wait_done()
    is_tts_playing = False

def synthesize(text):
    is_tts_playing = True

    inputs = tokenizer(text, return_tensors="pt")

    with torch.no_grad():
        output = model(**inputs).waveform

    waveform = output.squeeze().cpu().numpy()

    max_val = np.max(np.abs(waveform))
    if (max_val > 0):
        waveform = waveform / max_val

    waveform = (waveform * 32767).astype('int16')

    audio_segment = AudioSegment(
        waveform.tobytes(),
        frame_rate = model.config.sampling_rate,
        sample_width = waveform.dtype.itemsize,
        channels = 1
    )

    thread = threading.Thread(target=play_sound, args=(audio_segment,))
    thread.start()