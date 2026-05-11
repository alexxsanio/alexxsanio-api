from sent2vec.vectorizer import Vectorizer
from scipy.spatial.distance import cdist
import nltk
nltk.download('punkt_tab')
from nltk.tokenize import sent_tokenize
import numpy as np
import json, html, re


# ------ responsibility vs job experience ------

def sentences2vec(texts):
    sentences = sent_tokenize(texts)
    vectorizer = Vectorizer()
    vectorizer.run(sentences)
    vectors = vectorizer.vectors
    return vectors


def centroid_distance(A, B):
    A = np.array(A)
    B = np.array(B)
    centroid_A = A.mean(axis=0)
    centroid_B = B.mean(axis=0)
    return np.linalg.norm(centroid_A - centroid_B)


# ------ technical requirements vs technical skills ------

def highlight_text(text, keywords):
    text = html.escape(text)

    # sort keywords by length (important!)
    keywords = sorted(keywords, key=len, reverse=True)

    pattern = re.compile(
        r"\b(" + "|".join(map(re.escape, keywords)) + r")\b",
        re.IGNORECASE
    )

    def replacer(match):
        return f'<mark class="bg-yellow-300 px-1 rounded">{match.group(1)}</mark>'

    return pattern.sub(replacer, text)


def extract_matches(text, keywords):
    found = set()

    for kw in keywords:
        pattern = re.compile(rf"\b{re.escape(kw)}\b", re.IGNORECASE)
        if pattern.search(text):
            found.add(kw.lower())

    return found


# ---------- one-off functions ----------

def getSWESkills():
    with open('software_eng_skills.txt', 'r') as file:
        texts = file.read()

    tokens = texts.split("\n\n")
    skills = [token[:-1] for token in tokens[0::2]]

    print(skills)
    
    with open("SWESkills.json", "w") as f:
        json.dump(skills, f)

    return skills

def getAIEngSkills():
    with open('ai_eng_skills.txt', 'r') as file:
        texts = file.read()

    matches = [text.split(" - ") for text in texts.split("\n")]
    matches_flattened = []
    for match in matches:
        matches_flattened.extend(match)
    skills = matches_flattened[0::2][:-1]
    
    with open("AIEngSkills.json", "w") as f:
        json.dump(skills, f)

    return skills
