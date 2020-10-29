let range = 100;
let offsetX = 20;
let video, poseNet;
let poses = [];
let noseX, noseY;

let teapot, cow, light, human, pumpkin, teddy, trumpet;
let modelDisplay;

let speechRec, continuous, interimResults;

let statusPrompt, modelListPrompt;

function preload() {
  teapot = loadModel('assets/teapot.obj', true);
  cow = loadModel('assets/cow.obj', true);
  light = loadModel('assets/light.obj', true);
  human = loadModel('assets/human.obj', true);
  pumpkin = loadModel('assets/pumpkin.obj', true);
  teddy = loadModel('assets/teddy.obj', true);
  trumpet = loadModel('assets/trumpet.obj', true);
}

function setup() {
  createCanvas(400, 400, WEBGL);
  angleMode(DEGREES);
  smooth();
  normalMaterial();
  modelDisplay = 0;

  //Set up speech recognition 
  speechRec = new p5.SpeechRec('en-US', gotSpeech);
  continuous = true;
  interimResults = false;
  speechRec.start(continuous, interimResults);
  speechRec.onEnd = speechRestart;

  //Set up video capture
  video = createCapture(VIDEO);
  video.size(width, height);

  poseNet = ml5.poseNet(video, modelReady);
  setTimeout(detectPose, 4000);

  noseX = width / 2;
  noseY = height / 2;
  video.hide();

  statusPrompt = createElement('h2', 'Loading...');
}

function draw() {
  //background("#FFD93F");
  background(240);
  let rX = -map(noseY, 0, height, range*0.75, -range*0.75);
  let rY = -map(noseX, 0, width, -range, range);
  rotateX(rX - offsetX);
  if (modelDisplay == trumpet)
    rotateY(rY - 90);
  else
    rotateY(rY);
  rotateZ(180);
  if (modelDisplay != 0)
    model(modelDisplay);
}

function modelReady() {
  statusPrompt.html('Ready!<br>Speak Now...');
  modelListPrompt = createP('Say an object from the following:<br>Teapot / Pumpkin / Cow / Light<br>Teddy Bear / Trumpet / Human');
}

function detectPose() {
  poseNet.on('pose', function(results) {
    poses = results;
    noseX = width - (poses[0].pose.nose.x);
    noseY = poses[0].pose.nose.y;
  });
}

function gotSpeech() {
  if (speechRec.resultValue) {
    let said = speechRec.resultString;
    if (said == 'teapot')
      modelDisplay = teapot;
    else if (said == 'pumpkin')
      modelDisplay = pumpkin;
    else if (said == 'cow')
      modelDisplay = cow;
    else if (said == 'teddy bear')
      modelDisplay = teddy;
    else if (said == 'trumpet')
      modelDisplay = trumpet;
    else if (said == 'light')
      modelDisplay = light;
    else if (said == 'human')
      modelDisplay = human;
    else
      modelDisplay = 0;

    //Update status prompt
    if (modelDisplay == 0) {
      statusPrompt.html("We don't have it here :-( <br>You just said: " + capitalLetter(said));
    } else {
      statusPrompt.html(capitalLetter(said) + '<br>Try to move your head!');
    }
    modelListPrompt.html('You can keep saying:<br>Teapot / Pumpkin / Cow / Light<br>Teddy Bear / Trumpet / Human');
  }
}

function speechRestart() {
  speechRec.start(continuous, interimResults);
}

function capitalLetter(str) {
  str = str.split(" ");
  for (let i = 0, x = str.length; i < x; i++) {
    str[i] = str[i][0].toUpperCase() + str[i].substr(1);
  }
  return str.join(" ");
}

function keyPressed() {
  if (keyCode == 49)
    modelDisplay = teapot;
  else if (keyCode == 50)
    modelDisplay = pumpkin;
  else if (keyCode == 51)
    modelDisplay = cow;
  else if (keyCode == 52)
    modelDisplay = light;
  else if (keyCode == 53)
    modelDisplay = teddy;
  else if (keyCode == 54)
    modelDisplay = trumpet;
  else if (keyCode == 55)
    modelDisplay = human;
}