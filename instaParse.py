import csv
import json
import time
import requests
import numpy
import base64
from StringIO import StringIO
from PIL import Image
from scrapeUser import PageParser
import IPython

#API Access Info
access_Token = "179221684.d7e3d87.f1e9e9376ce848a484ee781f4b8f2ef3"
user_ID = "179221684" #Stans User ID

#Parse MaxPic number of past pictures 
maxPic = 450
#Parse MaxType number of types
maxType = 50
#Prase Number of Nouns
maxNoun = 10

max_ID = 0

urls_file = "urls.txt"

def getUrls(file):
    print "Reading urls..."
    with open(file) as f:
        content = f.readlines()
    return set(content)

urls = getUrls(urls_file)

print "Grabbed Results"
#Start Parsing Json

#Creates Array in a 2xMaxtype 
#Noun = Noun of type
#Number = number of nouns
typeNoun = [[None for _ in range(2)] for _  in range(maxType)]

#List of image links
nounDict = {}
picList = []
print "Starting Data Processing..."
for i, url in enumerate(urls):
    print "Processing {0}th url: {1}".format(i, url)
    if url.endswith("\n"):
        url = url[:-2]
    
    #load Data
    res = requests.get(url)
    raw_html = res.text
    
    likes, epoch_time, img_url = PageParser.get_info_from_post(raw_html)
        
    temp_time = time.gmtime(float(epoch_time))
    created_time = temp_time.tm_hour * 60 + temp_time.tm_min

    #Create Base64 of image
    try:
        img = Image.open(StringIO(requests.get(img_url).content))
        img_buffer = StringIO()
        img.save(img_buffer, format="JPEG")
        img64 = base64.b64encode(img_buffer.getvalue())
        
        #Extract label from Image
        googleCVurl = "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyC9zC3B3rndask9S46sBY8Srl0cit1yUws"
        request_struct = "{\"requests\":[{\"image\":{\"content\":\"" + img64 + "\"},\"features\":[{\"type\":\"LABEL_DETECTION\",\"maxResults\":\"" +  str(maxNoun) + "\"}]}]}"
        headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
        labelr = requests.post(googleCVurl , data=request_struct, headers=headers)
        outputjson = json.loads(labelr.text)
        nounList = {}
        
        #Create NounDict
    
        for label in outputjson['responses'][0]['labelAnnotations']:
            noun = label['description']
            if noun in nounDict:
                nounDict[noun] = nounDict[noun] + label['score']
            else:
                nounDict[noun] = label['score']
    except:
        continue
    nounList = nounDict.keys()        
    curPic = []
    curPic = [likes, created_time, nounList]
    picList.append(curPic)
    print "Finished Picture..."

#Weigh by Frequency and Confidence
sortedDict = sorted(nounDict.items(), key = lambda x:x[1])[::-1] 
del sortedDict[50:] 
print sortedDict
print picList

#generate symbol representation
symbols = ['likes', 'time']
for i in sortedDict:
    symbols.append(i[0])

#Creates output csv array
csvOut = []
csvOut.append(symbols)
#Create Output CSV list
#Format of CSV [Time since 00:00, Likes, 50 length list of 0s and 1s]
for curInst in picList:
    listOfNouns = [0 for _ in range(maxType)]
    curTemp = []
    index = 0
    state = 0
    for curNoun in sortedDict:
        for picNouns in curInst[2]:
            #IPython.embed()
            if picNouns == curNoun[0]:
                listOfNouns[index] = 1
                state = 1
                break
        if state == 1:
            break
        index = index + 1
    curTemp = [curInst[0], curInst[1]]
    curTemp.extend(listOfNouns)
    if state == 1:
        csvOut.append(curTemp)

outputNoun = [(x[0],i ) for i, x in enumerate(sortedDict)]
with open("data.csv", "wb") as f:
        writer = csv.writer(f)
        writer.writerows(csvOut)

with open("sortedNouns.csv", "wb") as s:
        writer = csv.writer(s)
        writer.writerows(outputNoun)

print outputNoun
print csvOut
