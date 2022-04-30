import pandas as pd
import sys
import re
import string
import nltk
from nltk.stem.porter import PorterStemmer
from nltk.stem import WordNetLemmatizer
from nltk.tokenize.treebank import TreebankWordDetokenizer
import joblib

if len(sys.argv) > 1:
    text = sys.argv[1]
else:
    sys.exit()

vectoriser = joblib.load('./ML/ContentAnalysis/CAVectoriser.sav')
classifier = joblib.load('./ML/ContentAnalysis/CAModel.sav')

#--------------Pre-Processing & Function Definitions----#
stopwords = nltk.corpus.stopwords.words('english')
def remove_stopwords(text):
    output= [i for i in text if i not in stopwords]
    return output

stemmer = PorterStemmer()
def stemming(text):
    stem_text = [stemmer.stem(word) for word in text]
    return stem_text

lemmatiser = WordNetLemmatizer()
def lemmatizer(text):
    lemm_text = [lemmatiser.lemmatize(word) for word in text]
    return lemm_text

def detokenise(text):
    joined_text = TreebankWordDetokenizer().detokenize(text)
    return joined_text


#Remove String Split Sequences (\n \r \t etc...)
text = " ".join(text.split())

#Remove Punctuation from the text
text = "".join([i for i in text if i not in string.punctuation])

#Convert the text to lower case
text = text.lower()

#Tokenise the text
text = re.split('W+',text)

#Remove Stopwords from the text
text = remove_stopwords(text)

#Stem the words in the text
text = stemming(text)

#Lemmatise the stemmed words
text = lemmatizer(text)

#Detokenise as we've finished Pre-Processing
#text = detokenise(text)

#---------------Vectorise and Pass to model----------#
textVector = vectoriser.transform(text)

pred = classifier.predict(textVector)

print (pred)

