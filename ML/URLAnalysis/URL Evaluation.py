import joblib
import sys
import pandas as pd

if len(sys.argv) > 1:
    url = sys.argv[1]
else:
    sys.exit()
    
# Pre-Processing
def makeTokens(f):
    tkns_BySlash = str(f.encode('utf-8')).split('/')	# make tokens splitting by slash
    total_Tokens = []
    for i in tkns_BySlash:
        tokens = str(i).split('-')	# make tokens splitting by dash
        tkns_ByDot = []
        for j in range(0,len(tokens)):
            temp_Tokens = str(tokens[j]).split('.')	# make tokens splitting by dot
            tkns_ByDot = tkns_ByDot + temp_Tokens
        total_Tokens = total_Tokens + tokens + tkns_ByDot
    total_Tokens = list(set(total_Tokens))
    if 'com' in total_Tokens:
        total_Tokens.remove('com')
    if 'co' in total_Tokens:
        total_Tokens.remove('co')
    return total_Tokens

#Load the Vectorizer
vectorizer = joblib.load('./ML/URLAnalysis/URLVectoriser.sav')

model = joblib.load('./ML/URLAnalysis/URLModel.sav')
ArrayURL=[]
ArrayURL.append(url)
url = vectorizer.transform(ArrayURL)
New_predict = model.predict(url)

print(New_predict[0])
    