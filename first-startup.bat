@echo off

::installing pip
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py

python get-pip.py

::installing everything needed

pip install -r requirements.txt

:: executing app.py

python deepface_test.py

Pause

::finished

ECHO Installation was completed

DEL first-startup.bat

Pause