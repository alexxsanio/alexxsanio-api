from transformers import SpeechT5Processor, SpeechT5ForTextToSpeech, SpeechT5HifiGan
from datasets import load_dataset
import torch
import soundfile as sf
import pymupdf
import numpy as np
import re, uuid


def is_normal_sentence(text):
    text = text.strip()

    # Too short
    if len(text) < 20:
        return False

    # Must contain multiple words
    words = text.split()
    if len(words) < 4:
        return False

    # Ratio of alphabetic chars
    alpha_ratio = sum(c.isalpha() for c in text) / max(len(text), 1)
    if alpha_ratio < 0.6:
        return False

    # Reject weird symbol-heavy text
    if re.search(r"[{}<>_=~|\\/]{2,}", text):
        return False

    # Reject all caps fragments
    if text.isupper():
        return False

    # Require at least one lowercase word
    if not re.search(r"\b[a-z]{2,}\b", text):
        return False

    return True

def clean_text(text):
    # Remove bullets / annotation symbols
    text = re.sub(r"[•◦▪■●◆►▶✓✔✦★]", " ", text)

    # Remove citations like [1], (1), superscripts-ish markers
    text = re.sub(r"\[\d+\]", " ", text)
    text = re.sub(r"\(\d+\)", " ", text)

    # Keep only English letters, numbers, and common punctuation
    text = re.sub(r"[^A-Za-z0-9.,;:!?()'\"/%+\-\s]", " ", text)

    # Remove isolated dots
    text = re.sub(r"\s*\.\s*", " ", text)

    # Collapse whitespace
    text = re.sub(r"\s+", " ", text).strip()

    return text

MAX_CHARS = 80

def split_text(text, max_chars=MAX_CHARS):
    tokens = text.split(" ")
    tokenLen = len(tokens)
    chunks_num = int(tokenLen/max_chars)

    chunks = []
    for i in range(chunks_num):
        start = i*max_chars
        end = (i+1)*max_chars
        if end > tokenLen:
            end = tokenLen
        chunks.append(" ".join(tokens[start:end]))

    return chunks

def pdf2texts(pdfname, start_page, end_page):
    doc = pymupdf.open(pdfname)
    pages = doc[start_page:end_page+1]

    blocks = []

    for page in pages:
        blocks_page = page.get_text("dict")["blocks"]
        blocks.extend(blocks_page)

    texts_res = ""
    for block in blocks:
        if block["type"] == 0:  # text block
            for line in block["lines"]:
                for span in line["spans"]:
                    texts = clean_text(span['text'])
                    if is_normal_sentence(texts): 
                        texts_res += texts + " "
    return texts_res

processor = SpeechT5Processor.from_pretrained(
    "microsoft/speecht5_tts"
)

model = SpeechT5ForTextToSpeech.from_pretrained(
    "microsoft/speecht5_tts"
)

vocoder = SpeechT5HifiGan.from_pretrained(
    "microsoft/speecht5_hifigan"
)

# Speaker embedding
embeddings_dataset = load_dataset(
    "Matthijs/cmu-arctic-xvectors",
    split="validation"
)

speaker_embeddings = torch.tensor(
    embeddings_dataset[7306]["xvector"]
).unsqueeze(0)

def text2speech(texts):
    chunks = split_text(texts)

    audio_segments = []

    for chunk in chunks:
        print("len(chunks)=====================", chunk)
        inputs = processor(text=chunk, return_tensors="pt")

        speech = model.generate_speech(
            inputs["input_ids"],
            speaker_embeddings,
            vocoder=vocoder
        )

        audio_segments.append(speech.numpy())

    combined_audio = np.concatenate(audio_segments)

    filename = f"/tmp/{uuid.uuid4()}.wav"

    sf.write(filename, combined_audio, samplerate=16000)

    return filename





