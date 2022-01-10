@echo off

::installing python


::installing pip
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py

python get-pip.py

::installing everything needed

pip install -r requirements.txt


:: executing app.py

python3 deepface_test.py

Pause

::finished

ECHO Installation was completed

ren not_this.bat start.bat

start start.bat

DEL first-startup.bat

Pause
