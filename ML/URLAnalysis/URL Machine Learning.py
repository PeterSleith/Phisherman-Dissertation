import pandas as pd
import numpy as np
import random
import joblib
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split

# Load Url Data 
urls_data = pd.read_csv("./ML/URLAnalysis/phishing_site_urls.csv")

#Tokenise the URLs
def makeTokens(f):
    tkns_BySlash = str(f.encode('utf-8')).split('/')	# make tokens splitting by slash
    total_Tokens = []
    for i in tkns_BySlash:
        tokens = str(i).split('-')	# make tokens splitting by hyphen
        tkns_ByDot = []
        for j in range(0,len(tokens)):
            temp_Tokens = str(tokens[j]).split('.')	# make tokens splitting by dot
            tkns_ByDot = tkns_ByDot + temp_Tokens
        total_Tokens = total_Tokens + tokens + tkns_ByDot
    total_Tokens = list(set(total_Tokens))
    if 'com' in total_Tokens:
        total_Tokens.remove('com')	#removing .com and .co
    if 'co' in total_Tokens:
        total_Tokens.remove('co')
    return total_Tokens

# Labels
y = urls_data["Label"]

# Features
url_list = urls_data["URL"]

# Using Tokenizer
X_train, X_test, y_train, y_test = train_test_split(url_list, y, test_size=0.2, random_state=42)

vectorizer = TfidfVectorizer(tokenizer=makeTokens)
X_train = vectorizer.fit_transform(X_train)
X_test = vectorizer.transform(X_test)

# Model Building
#using logistic regression
classifier = MultinomialNB()
classifier.fit(X_train, y_train)

#Save the Model & Vectoriser
filename = 'URLModel.sav'
joblib.dump(classifier, filename)

filename = 'URLVectoriser.sav'
joblib.dump(vectorizer, filename)
