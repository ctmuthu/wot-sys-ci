########################################################################################
# This script adjusts a paper to completely fill the number of pages set below in the
# variable "pageGoal". The command "baselinestretch" must not be used in the document,
# as it is introduced by the script. You can modify the starting value in the parameters
# below.
########################################################################################
# Put the two input commands into the main tex document.  
# Position of commands:
# \input{autoscale.par} goes somewhere in front of \begin{document}
# \input{autoscalelit.par} goes into the document body directly before \bibliography{} is called 
# Commands (copy without #):
# \input{autoscale.par}
# \input{autoscalelit.par}
########################################################################################
# Next, please modify the following parameters:
pathToFile="./"
texFile="conference_071817"
pdfFile="conference_071817.pdf"
InitBaselineStretch=1.0
pageGoal=8
########################################################################################
# Finally, call the script on the command line: python autoscale.py
########################################################################################


from PyPDF2 import PdfFileReader
import subprocess
import platform
import time


# initial preparation of files
baselinestretch=InitBaselineStretch
f = open(pathToFile+'autoscale.par.tex','w')
f.write('\\renewcommand{\\baselinestretch}{'+"{0:.2f}".format(baselinestretch)+'}') 
f.close() 
	
f = open(pathToFile+'autoscalelit.par.tex','w')
f.write('\\renewcommand{\\baselinestretch}{'+"{0:.2f}".format(baselinestretch)+'}') 
f.close() 

if platform.system() == 'Windows':
	command = "pdflatex.exe"
	shell_bin=True
	mode="-interaction=nonstopmode"
	output=subprocess.PIPE
	quiet="-quiet"
elif platform.system() == 'Linux':
	command = "pdflatex"
	shell_bin=False
	mode="-interaction=batchmode"
	o = open('/dev/null','wb')
	output=o
	quiet=""
else:
  print(platform.system()+" is not supported")

print("starting initial build of "+texFile+" in folder "+pathToFile)

# initial build
Temp=subprocess.call([command,mode, quiet, texFile], cwd=pathToFile, shell=shell_bin, stdout=output)

# get initial number of pages
pdf = PdfFileReader(open(pathToFile+pdfFile,'rb'))
numOfPages=pdf.getNumPages()

# tune the main document baselinestretch

# 
if numOfPages<=pageGoal:
	while numOfPages<=pageGoal:
		baselinestretch+=0.01
		f = open(pathToFile+'autoscale.par.tex','w')
		f.write('\\renewcommand{\\baselinestretch}{'+"{0:.2f}".format(baselinestretch)+'}') 
		f.close() 
		Temp=subprocess.call([command,mode, quiet, texFile], cwd=pathToFile, shell=shell_bin, stdout=output)
		pdf = PdfFileReader(open(pathToFile+pdfFile,'rb'))
		numOfPages=pdf.getNumPages()
		print("\n---------------------------------------")
		print("Main Baselinestretch: "+"{0:.2f}".format(baselinestretch))
		print("Current number of pages: "+str(numOfPages))
		

while numOfPages>pageGoal:
	baselinestretch-=0.01
	f = open(pathToFile+'autoscale.par.tex','w')
	f.write('\\renewcommand{\\baselinestretch}{'+"{0:.2f}".format(baselinestretch)+'}') 
	f.close() 
	Temp=subprocess.call([command,mode, quiet, texFile], cwd=pathToFile, shell=shell_bin, stdout=output)
	pdf = PdfFileReader(open(pathToFile+pdfFile,'rb'))
	numOfPages=pdf.getNumPages()
	print("\n---------------------------------------")
	print("Main Baselinestretch: "+"{0:.2f}".format(baselinestretch))
	print("Current number of pages: "+str(numOfPages))
	

baselinestrech_document = baselinestretch

# now do the fine tuning by adjusting the literature baselinestretch	
baselinestretch=InitBaselineStretch
while numOfPages<=pageGoal:
	baselinestretch+=0.01
	f = open(pathToFile+'autoscalelit.par.tex','w')
	f.write('\\renewcommand{\\baselinestretch}{'+"{0:.2f}".format(baselinestretch)+'}') 
	f.close() 
	Temp=subprocess.call([command,mode, quiet,texFile], cwd=pathToFile, shell=shell_bin, stdout=output)
	pdf = PdfFileReader(open(pathToFile+pdfFile,'rb'))
	numOfPages=pdf.getNumPages()
	print("\n---------------------------------------")
	print("Literature Baselinestretch: "+"{0:.2f}".format(baselinestretch))
	print("Current number of pages: "+str(numOfPages))
	if (baselinestretch - baselinestrech_document) > 0.5:
		print("It seems the document is not accepting baselinestretch for literature. Aborting...")
		exit()

while numOfPages>pageGoal:
	baselinestretch-=0.01
	f = open(pathToFile+'autoscalelit.par.tex','w')
	f.write('\\renewcommand{\\baselinestretch}{'+"{0:.2f}".format(baselinestretch)+'}') 
	f.close() 
	Temp=subprocess.call([command,mode, quiet, texFile], cwd=pathToFile, shell=shell_bin, stdout=output)
	pdf = PdfFileReader(open(pathToFile+pdfFile,'rb'))
	numOfPages=pdf.getNumPages()
	print("\n---------------------------------------")
	print("Literature Baselinestretch: "+"{0:.2f}".format(baselinestretch))
	print("Current number of pages: "+str(numOfPages))

print("\n---------------------------------------")
print("DONE")



