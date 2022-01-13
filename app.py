from flask import Flask, render_template, request, jsonify
import base64
import logging
import numpy as np
from deepface import DeepFace
from PIL import Image
from io import BytesIO
import subprocess
import os
import cv2
import random
import webbrowser

app = Flask(__name__)
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)
faceCascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

error_path = {'race': {'asian': 0, 'indian': 0, 'black': 0, 'white': 0,
                       'middle eastern': 0, 'latino hispanic': 0}, 'dominant_race': '?'}
directory = 'static/img'

if 'img' not in os.listdir('static/'):
    os.mkdir(directory)

for f in os.listdir(directory):
    os.remove(os.path.join(directory, f))


def generate_random_string():
    numbers = '1234567890'
    res = ''.join(random.choice(numbers) for _ in range(10))
    return f'{directory}/{res}.png'


@app.route('/')
def main():
    return render_template('index.html')


@app.route('/photocap')
def photo_cap():
    photo_base64 = request.args.get('photo')

    _, encoded = photo_base64.split(",", 1)
    binary_data = base64.b64decode(encoded)

    f = BytesIO()
    f.write(binary_data)
    f.seek(0)
    image = Image.open(f)
    image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = faceCascade.detectMultiScale(gray, 1.3, 5)

    for (x, y, w, h) in faces:
        cv2.rectangle(image, (x, y), (x+w, y+h), (0, 255, 0), 2)
    fn = generate_random_string()

    cv2.imwrite(fn, image)
    try:
        obj = DeepFace.analyze(image, actions=['race'])
        obj['filename'] = fn
        return jsonify(obj)

    except ValueError:
        other_json = error_path
        other_json['filename'] = fn

        return jsonify(other_json)

    except Exception as e:
        print(e)
        other_json = error_path
        other_json['filename'] = fn

        return jsonify(other_json)


if __name__ == "__main__":
    # p = subprocess.Popen(['python -m SimpleHTTPServer'], shell=True) #Only for macOS
    webbrowser.open_new('http://127.0.0.1:8000/')
    app.run(host='localhost', port=8000, debug=True)
