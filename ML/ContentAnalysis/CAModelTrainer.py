import pandas as pd
import re
import string
import nltk
from nltk.stem.porter import PorterStemmer
from nltk.stem import WordNetLemmatizer
from nltk.tokenize.treebank import TreebankWordDetokenizer

data = pd.read_csv("./ML/ContentAnalysis/CAModifiedDataset.csv")

#--------------Pre-Processing & Function Definitions----#
def remove_punctuation(text):
    punctuationfree="".join([i for i in text if i not in string.punctuation])
    return punctuationfree

def remove_strSplits(text):
    splitfree=" ".join(text.split())
    return splitfree

def tokenization(text):
    tokens = re.split('W+',text)
    return tokens

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
data['text'] = data['text'].apply(lambda x:remove_strSplits(x))

#Remove Punctuation from the text
data['text'] = data['text'].apply(lambda x:remove_punctuation(x))

#Convert the text to lower case
data['text'] = data['text'].apply(lambda x: x.lower())

#Tokenise the text
data['text'] = data['text'].apply(lambda x: tokenization(x))

#Remove Stopwords from the text
data['text'] = data['text'].apply(lambda x:remove_stopwords(x))

#Stem the words in the text
data['text']=data['text'].apply(lambda x: stemming(x))

#Lemmatise the stemmed words
data['text']=data['text'].apply(lambda x:lemmatizer(x))

#Detokenise as we've finished Pre-Processing
data['text']=data['text'].apply(lambda x:detokenise(x))


#---------------Feature Extraction----------------------#
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction.text import CountVectorizer

X_train, X_test, y_train, y_test = train_test_split(data['text'], data['label'], test_size=0.20, random_state=0)

#TF-IDF
vectoriser = TfidfVectorizer()
X_train = vectoriser.fit_transform(X_train)
X_test = vectoriser.transform(X_test)


#--------------Training and Model Evaluation-----------#
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score
from sklearn.metrics import accuracy_score,precision_score,recall_score

classifier = RandomForestClassifier(n_estimators=200,max_depth=None)
classifier.fit(X_train, y_train.values.ravel())

y_pred = classifier.predict(X_test)

print("Model Trained")

#-------------Export the Model & Vectoriser------------#
import joblib
filename = './ML/ContentAnalysis/CAModel.sav'
joblib.dump(classifier, filename)

filename = './ML/ContentAnalysis/CAVectoriser.sav'
joblib.dump(vectoriser, filename)
