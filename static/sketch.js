let audio, analyzer;
let asian = [];
let white = [];
let other = [];
let main_div;
var video;
var button;
var dur;
var elmo, paused_image, elmo_image;
var subtitles;
var voice_line;
var last_line;


function preload() {
  puppet = [loadSound('static/Sound/Asian/Puppet.mp3'), `Elmo's a puppet, not a dog! Please don't try to eat me.`];
  assembly_line = [loadSound("static/Sound/Asian/Assembly_Line.mp3"), `Oh an Asian! Elmo remembers you from the assembly line!`];
  iphones = [loadSound("static/Sound/Asian/Iphones.mp3"), `Take a break from playing with Elmo, iPhones aren't gonna make themselves!`];

  black = [loadSound("static/Sound/Black/black.mp3"), `I respect and admire your rich culture, and will now narrate a documentary: an African American trials and tribulations. Chapter 1:`];

  hispanic = [loadSound("static/Sound/Hispanic/hispanic.mp3"), `Elmo respects all individuals of Hispanic lineage, and wish you a wonderful day :D`];

  no_idea = [loadSound("static/Sound/Other/No_idea.mp3"), `Elmo can't make fun of you because he has no idea what race you are.`];
  what = [loadSound("static/Sound/Other/What.mp3"), `White? Asian? Elmo can't tell what you are.`];

  meth = [loadSound("static/Sound/White/white_meth.mp3"), `White people like you reminds Elmo of Cookie Monster... but with meth. Yeah.`];
  south = [loadSound("static/Sound/White/white_south.mp3"), `You look like you're from the south, Sesame Street might be a little too hot for you.`];

  asian = [puppet, assembly_line, iphones];
  white = [meth, south];
  other = [no_idea, what];
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  //video
  video = createCapture(VIDEO);

  main_div = createDiv();
  main_div.id('camera-div');
  main_div.position(width*0.1, width/15);
  main_div.size(width*0.6, height*0.6);

  video.id('facecam');
  video.parent('camera-div');
  video.size((width/5 * (16/9)), width/5);
  createElement('br').parent('camera-div');
  button = createButton('trigger me');

  button.id('trigger-button');
  button.parent('camera-div');
  button.position(50, video.height);
  button.size(width*0.08, width*0.02);
  button.style('font-size', `${width*0.01}px`);
  
  elmo = createElement('img').parent('camera-div');
  paused_image = createElement('img').parent('camera-div');
  paused_image.id('paused-image');

  elmo.id('elmo-image');
  document.getElementById('elmo-image').src = `static/elmo_face/elmo2.png`;
  elmo.position(video.width, video.height*0.25);
  elmo.size(width/6, width/6);

  analyzer = new p5.Amplitude();
  analyzer.setInput(audio);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  main_div.position(width*0.1, width/15);
  main_div.size(width*0.6, height*0.6);
  video.size((width/5 * (16/9)), width/5);
  button.position(50, video.height);
  button.size(width*0.08, width*0.02);
  button.style('font-size', `${width*0.01}px`);
  elmo.position(video.width, video.height*0.25);
  elmo.size(width/6, width/6);
}

function draw() {
    button.mousePressed(function main_function() {
      button.hide();
    
      video.loadPixels();
      var data_uri = video.canvas.toDataURL();
      
      video.hide();
      document.getElementById("paused-image").src = data_uri;
    
      $.ajax({
      url : "/photocap",
      data : {"photo": data_uri},
      success : function(response){
        document.getElementById('race').innerHTML = "<p>Predictions: <br>Asian: "+response.race.asian+"<br>Black: "+response.race.black+"<br>Hispanic: "+response['race']['latino hispanic']+"<br>White: "+response.race.white+"<br>Indian: "+response.race.indian+"<br>Middle eastern: "+response['race']['middle eastern']+"<br><br>Race: "+response.dominant_race+"</p>";
        document.getElementById('paused-image').src = response.filename;
        if (["asian", "indian"].includes(response.dominant_race)){
          voice_line = asian[Math.floor(Math.random() * asian.length)];
          while (last_line === voice_line){
            voice_line = asian[Math.floor(Math.random() * asian.length)];
          }
        } else if (response.dominant_race == "black"){
          voice_line = black;
        } else if (response.dominant_race == "latino hispanic"){
          voice_line = hispanic;
        } else if (["white", "middle eastern"].includes(response.dominant_race)){
          voice_line = white[Math.floor(Math.random() * white.length)];
          while (last_line === voice_line){
            voice_line = white[Math.floor(Math.random() * white.length)];
          }
        } else if (response.dominant_race == "?"){
          voice_line = other[Math.floor(Math.random() * other.length)];
          while (last_line === voice_line){
            voice_line = other[Math.floor(Math.random() * other.length)];
          }
        }
        last_line = voice_line;
        audio = voice_line[0];
        subtitles = voice_line[1];

        document.getElementById('subtitles-text').innerText = subtitles;
    
        audio.play();
        var dur = audio.duration();
    
        setTimeout(function(){
          button.show();
          document.getElementById('race').innerHTML = "";
          document.getElementById("paused-image").src = '';
          document.getElementById("subtitles-text").innerText = '';
          video.show();
        },dur*1000);
      }})
  });
  let rms = analyzer.getLevel();
  if (rms > 0.02){
    elmo_image = `static/elmo_face/elmo.png`
  } else{
    elmo_image = `static/elmo_face/elmo2.png`
  };
  document.getElementById('elmo-image').src = elmo_image;
}
function touchStarted() {
  getAudioContext().resume()
}
