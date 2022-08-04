import json
import time
import board
from time import sleep
import neopixel
import numpy as np
import json
import requests

#change these values to specify size of each row
r1size=8
r2size=7
r3size=6
r4size=6
r5size=0
r6size=0

#choose a brightness between 0 and 1
bright=0.3

#choose a delay between running the script
delay=3


pix = neopixel.NeoPixel(board.D12, 3*(r1size+r2size+r3size+r4size+r5size+r6size), brightness=bright)

r1=requests.post('https://10.1.210.32:8002/api/Logins/Login', json='BusPI', verify=False)

while True:
#iterates through state matrix and updates LEDs based on states (if socketUserId is NULL, then availabe, if not null than unavailable)
    def LEDUpdate(stateMat):
        for row in stateMat:
            for col in range(len(row)):
                rowIn=stateMat.index(row)
                #1d matrix implementation (better for implementing on larger scale, more computations)
                if rowIn==0:
                    offset=3*(r1size-col)
                    if row[col]==None:
                        time.sleep(0.01)
                        pix[offset-1]=(0,255,0)
                        time.sleep(0.01)
                        pix[offset-2]=(0,255,0)
                        time.sleep(0.01)
                        pix[offset-3]=(0,255,0)
                    else:
                        time.sleep(0.01)
                        pix[offset-1]=(255,0,0)
                        time.sleep(0.01)
                        pix[offset-2]=(255,0,0)
                        time.sleep(0.01)
                        pix[offset-3]=(255,0,0)
                elif rowIn==1:
                    offset=3*(r1size+r2size-col)
                    offset=3*(r1size+col)
                    if row[col]==None:
                        time.sleep(0.01)
                        pix[offset]=(0,255,0)
                        time.sleep(0.01)
                        pix[offset+1]=(0,255,0)
                        time.sleep(0.01)
                        pix[offset+2]=(0,255,0)
                    else:
                        time.sleep(0.01)
                        pix[offset]=(255,0,0)
                        time.sleep(0.01)
                        pix[offset+1]=(255,0,0)
                        time.sleep(0.01)
                        pix[offset+2]=(255,0,0)
                elif rowIn==2:
                    offset=3*(r1size+r2size+r3size-col)
                    if row[col]==None:
                        time.sleep(0.01)
                        pix[offset-1]=(0,255,0)
                        time.sleep(0.01)
                        pix[offset-2]=(0,255,0)
                        time.sleep(0.01)
                        pix[offset-3]=(0,255,0)
                    else: 
                        time.sleep(0.01)
                        pix[offset-1]=(255,0,0)
                        time.sleep(0.01)
                        pix[offset-2]=(255,0,0)
                        time.sleep(0.01)
                        pix[offset-3]=(255,0,0)
                elif rowIn==3:
                    offset=3*(r1size+r2size+r3size+col)
                    if row[col]==None:
                        time.sleep(0.01)
                        pix[offset]=(0,255,0)
                        time.sleep(0.01)
                        pix[offset+1]=(0,255,0)
                        time.sleep(0.01)
                        pix[offset+2]=(0,255,0)
                    else:
                        time.sleep(0.01)
                        pix[offset]=(255,0,0)
                        time.sleep(0.01)
                        pix[offset+1]=(255,0,0)
                        time.sleep(0.01)
                        pix[offset+2]=(255,0,0)
                elif rowIn==4:
                    offset=3*(r1size+r2size+r3size+r4size+r5size-col)
                    if row[col]==None:
                        time.sleep(0.01)
                        pix[offset-1]=(0,255,0)
                        time.sleep(0.01)
                        pix[offset-2]=(0,255,0)
                        time.sleep(0.01)
                        pix[offset-3]=(0,255,0)
                    else:
                        time.sleep(0.01)
                        pix[offset-1]=(255,0,0)
                        time.sleep(0.01)
                        pix[offset-2]=(255,0,0)
                        time.sleep(0.01)
                        pix[offset-3]=(255,0,0)
                elif rowIn==5:
                    offset=3*(r1size+r2size+r3size+r4size+r5size+col)
                    if row[col]==None:
                        time.sleep(0.01)
                        pix[offset]=(0,255,0)
                        time.sleep(0.01)
                        pix[offset+1]=(0,255,0)
                        time.sleep(0.01)
                        pix[offset+2]=(0,255,0)
                    else:
                        time.sleep(0.01)
                        pix[offset]=(255,0,0)
                        time.sleep(0.01)
                        pix[offset+1]=(255,0,0)
                        time.sleep(0.01)
                        pix[offset+2]=(255,0,0)                 
    #fils out state matrix with values from the state list (stateMat type: List[List[]])
    def stateMatFill(stateList):
    #initialize each row as a list of zeroes
        row1=[0]*r1size 
        row2=[0]*r2size
        row3=[0]*r3size
        row4=[0]*r4size
        row5=[0]*r5size
        row6=[0]*r6size
    #fill in each row and save each row into text file
        for i in range(r1size):
            row1[i]=stateList[i]
        for i in range(r2size):
            row2[i]=stateList[i+r1size]
        for i in range(r3size):
            row3[i]=stateList[i+r1size+r2size]
        for i in range(r4size):
            row4[i]=stateList[i+r1size+r2size+r3size]
        for i in range(r5size):
            row5[i]=stateList[i+r1size+r2size+r3size+r4size]
        for i in range(r6size):
            row6[i]=stateList[i+r1size+r2size+r3size+r4size+r6size]
#append each row into the resulting non rectangular LED state matrix and write to file
        stateMat=[]
        stateMat.append(row1)
        stateMat.append(row2)
        stateMat.append(row3)
        stateMat.append(row4)
        stateMat.append(row5)
        stateMat.append(row6)
#with the new state matrix, update LEDs
        LEDUpdate(stateMat)
    #loads needed json information from api call to an array and builds state list array 
    def jsonLoad(input):
        url=('https://10.1.210.32:8002/api/Labs/?extend=true')
        r2=requests.get(url,cookies=r1.cookies, verify=False)
        with open(input, "w") as outfile: 
            json.dump(r2.json(), outfile)
        with open(input) as input_file:
            old_data = json.load(input_file)# Transform json input to python objects
        jsonStr=json.dumps(old_data)
        aList = json.loads(jsonStr)
        #this is the part of the code that may have to be changed for different labs
        #for 6th floor lab right wall: metTotal = len(aList[1]['tables'][
        metTotal=len(aList[0]['tables'][0]['locations']) #get total number of sockets on wall
        stateList=[0]*metTotal
        for i in range(metTotal):
            stateList[i]=aList[0]['tables'][0]['locations'][i]['sockets'][0]['socketUserId']
        stateMatFill(stateList)
    jsonLoad("socketAPICall")
    sleep(delay)
