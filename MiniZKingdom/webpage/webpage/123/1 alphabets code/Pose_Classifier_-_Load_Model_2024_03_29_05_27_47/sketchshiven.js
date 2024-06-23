// ml5.js: Pose Classification
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/Courses/ml5-beginners-guide/7.2-pose-classification.html
// https://youtu.be/FYgYyq-xqAw

// All code: https://editor.p5js.org/codingtrain/sketches/JoZl-QRPK

// Separated into three sketches
// 1: Data Collection: https://editor.p5js.org/codingtrain/sketches/kTM0Gm-1q
// 2: Model Training: https://editor.p5js.org/codingtrain/sketches/-Ywq20rM9
// 3: Model Deployment: https://editor.p5js.org/codingtrain/sketches/c5sDNr8eM

let video;
let poseNet;
let pose;
let skeleton;

let brain;
let poseLabel = "";
let modelSelect = 0;
let modelArray = ['abcd', 'efg', 'hijk', 'lmnop', 'qrst', 'uvw', 'xyz'];
let modelInfo;
const alphabetText = {
  "A": "A for Apple, A for Ant",
  "B": "B for Ball, B for Bat",
  "C": "C for Carrot, C for Car",
  "D": "D for Duck, D for Dog",
  "E": "E for Elephant, E for Egg",
  "F": "F for Fish, F for Flag",
  "G": "G for Guitar, G for Gift",
  "H": "H for Hammer, H for Hat",
  "I": "I for Indian, I for Ice",
  "J": "J for Jam, J for Juice",
  "K": "K for Kangaroo, K for Key",
  "L": "L for Ladder, L for Leaf",
  "M": "M for Monkey, M for Mouse",
  "N": "N for Nail, N for Nose",
  "O": "O for Ocean, O for Orange",
  "P": "P for Paint, P for Popcorn",
  "Q": "Q for Question, Q for Queen",
  "R": "R for Radio, R for Race",
  "S": "S for Snow, S for Snake",
  "T": "T for Tree, T for Train",
  "U": "U for Umbrella, U for Unicorn",
  "V": "V for Vacuum, V for Violin",
  "W": "W for Whale, W for Watch",
  "X": "X for Xerox, X for X-Ray",
  "Y": "Y for Yo yo, Y for Yellow",
  "Z": "Z for Zebra, Z for Zoo"
};

function keyPressed() {
  if (key == 'ArrowRight') {
    if (modelSelect == 6) {
      modelSelect = 0;
    } else {
      modelSelect += 1;
    }
    console.log('models/' + modelArray[modelSelect] + '/model_meta.json');

    modelInfo = {
      model: `models/${modelArray[modelSelect]}/model.json`,
      metadata: `models/${modelArray[modelSelect]}/model_meta.json`,
      weights: `models/${modelArray[modelSelect]}/model.weights.bin`,
    };
    brain.load(modelInfo, brainLoaded);

  } else if (key == 'ArrowLeft') {
    if (modelSelect == 0) {
      modelSelect = 6;
    } else {
      modelSelect -= 1;
    }
    console.log('models/' + modelArray[modelSelect] + '/model_meta.json');

    modelInfo = {
      model: `models/${modelArray[modelSelect]}/model.json`,
      metadata: `models/${modelArray[modelSelect]}/model_meta.json`,
      weights: `models/${modelArray[modelSelect]}/model.weights.bin`,
    };
    brain.load(modelInfo, brainLoaded);

  } else {
    console.log("press ArrowLeft or ArrowRight")
    console.log('models/' + modelArray[modelSelect] + '/model_meta.json');
  }
}

function setup() {

  // Create a canvas within the div container
  let canvas = createCanvas(640, 480);
  canvas.parent('canvasContainer'); // Specify parent div

  // createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);

  let options = {
    inputs: 34,
    outputs: 4,
    task: 'classification',
    debug: true
  }
  brain = ml5.neuralNetwork(options);
  modelInfo = {
    model: `models/${modelArray[modelSelect]}/model.json`,
    metadata: `models/${modelArray[modelSelect]}/model_meta.json`,
    weights: `models/${modelArray[modelSelect]}/model.weights.bin`,
  };
  brain.load(modelInfo, brainLoaded);
}

function brainLoaded() {
  setTimeout(function () {
    console.log('pose classification ready!');
    nextPreviousModel(modelSelect);
    classifyPose();
  }, 1000);
}

function nextPreviousModel(modelSelect){
  var innerModelSelect1 = modelSelect;
  var innerModelSelect2 = modelSelect;

  var next = document.getElementById("currentMode");
  next.innerHTML = modelArray[modelSelect].toUpperCase();

  var previous = document.getElementById("previousModel");
  if (innerModelSelect1 == 0) {
    innerModelSelect1 = 6;
  } else {
    innerModelSelect1 -= 1;
  }
  previous.innerHTML = modelArray[innerModelSelect1].toUpperCase();

  var next = document.getElementById("nextModel");
  if (innerModelSelect2 == 6) {
    innerModelSelect2 = 0;
  } else {
    innerModelSelect2 += 1;
  }
  next.innerHTML = modelArray[innerModelSelect2].toUpperCase();
}

function classifyPose() {
  if (pose) {
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
    }
    brain.classify(inputs, gotResult);
  } else {
    setTimeout(classifyPose, 100);
  }
}

function gotResult(error, results) {
  if (results[0].confidence > 0.96) {
    poseLabel = results[0].label.toUpperCase();
    addAudioElement(poseLabel, "myAudio");
    addTextElement(poseLabel);
    setTimeout(function () {
      classifyPose();
    }, 5000);
  } else {
    poseLabel = "";
    classifyPose();
  }
  // console.log(results[0].confidence);
}

// addAudioElement("U", "myAudio");
// addTextElement("U");

function addAudioElement(poseLabel, audioElementId) {
  // Set the audio file path and type
  var audioFile = "audio/" + poseLabel + ".m4a";
  var audioType = "audio/m4a";

  // Get the target audio element by its ID
  var audio = document.getElementById(audioElementId);

  // Set the audio file path and type
  audio.src = audioFile;
  audio.type = audioType;

  // Add an event listener to handle the audio playback
  audio.addEventListener("play", function () {
    console.log("Audio playing...");
  });

  // Start the audio file automatically
  audio.play();

  audioFile = "";
  audioType = "";

}

function addTextElement(poseLabel) {
  // Get a reference to the div element
  var myDiv = document.getElementById("textBox");
  // Check if the poseLabel exists in the alphabetText
  if (alphabetText.hasOwnProperty(poseLabel)) {
    // Set the innerHTML property to change the text
    myDiv.innerHTML = alphabetText[poseLabel];
    console.log(alphabetText[poseLabel]);
  } else {
    // If poseLabel is not found, display a message
    myDiv.innerHTML = "Text not found for this label";
    console.log("Text not found for this label");
  }
  setTimeout(function () {
    myDiv.innerHTML = "";
    console.log("Text cleared");
  }, 5500);
}

// function addTextElement(poseLabel) {
//   // Get a reference to the div element
//   var myDiv = document.getElementById("textbox");
//   console.log(poseLabel);
//   console.log(alphabetText[poseLabel]);
//   // Set the innerHTML property to change the text
//   myDiv.innerHTML = alphabetText[poseLabel];
// }

// var wait = (ms) => {
//   const start = Date.now();
//   let now = start;
//   while (now - start < ms) {
//     now = Date.now();
//   }
// }

// let poseLabelBefore = "";
// let poseLabelAfter = "";

// function gotResult(error, results) {
//   if (results[0].confidence >= 0.96) {
//     poseLabelBefore = results[0].label.toUpperCase();
//     wait(2000);
//     poseLabelAfter = results[0].label.toUpperCase();
//     if(poseLabelBefore == poseLabelAfter){
//       poseLabel = results[0].label.toUpperCase();
//       console.log(results[0].confidence);
//     }
//   }
//   else{
//     poseLabel = ""; 
//   }
//   // Call the function with the audio file path and type
//   addAudioElement(poseLabel);
//   // console.log(results[0].confidence);
//   classifyPose();
// }


// function addAudioElement(poseLabel) {

//   // Set the audio file path and type
//   var audioFile = "audio/" + poseLabel + ".m4a";
//   var audioType = "audio/m4a";

//   // Create an audio element
//   var audio = document.createElement("audio");

//   // Set the audio file path and type
//   audio.src = audioFile;
//   audio.type = audioType;

//   // Add controls to the audio element
//   audio.controls = true;

//   // Add an event listener to handle the audio playback
//   audio.addEventListener("play", function() {
//     console.log("Audio playing...");
//   });

//   // audio.addEventListener("pause", function() {
//   //   console.log("Audio paused...");
//   // });

//   // audio.addEventListener("volumechange", function() {
//   //   console.log("Volume changed...");
//   // });

//   // Add an event listener to remove the audio element after playback
//   audio.addEventListener("ended", function() {
//     console.log("Audio playback ended...");
//     audio.parentNode.removeChild(audio);
//   });

//   // Add the audio element to the webpage
//   document.body.appendChild(audio);

//   // Start the audio file automatically
//   audio.play();
//   // wait(5000);
// }

function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}


function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
  push();
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, video.width, video.height);

  if (pose) {
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(0);

      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0);
      stroke(255);
      ellipse(x, y, 16, 16);
    }
  }
  pop();

  fill(255, 0, 255);
  noStroke();
  textSize(100);
  textAlign(CENTER, CENTER);
  text(poseLabel, 100, 100);
}