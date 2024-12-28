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
// let modelSelect = 0;
// let modelArray = ['012', '345', '6789'];
let modelInfo;
const alphabetText = {
  "FLASH": "The Flash",
  "HULK": "The Incredible Hulk",
  "SPIDERMAN": "The Spiderman",
  "WAKANDA FOREVER": "Black Panther - Wakanda Forever",
};

// function keyPressed() {
//   if (key == 'ArrowRight') {
//     if (modelSelect == 2) {
//       modelSelect = 0;
//     } else {
//       modelSelect += 1;
//     }
//     console.log('models/' + modelArray[modelSelect] + '/model_meta.json');

//     modelInfo = {
//       model: `models/${modelArray[modelSelect]}/model.json`,
//       metadata: `models/${modelArray[modelSelect]}/model_meta.json`,
//       weights: `models/${modelArray[modelSelect]}/model.weights.bin`,
//     };
//     brain.load(modelInfo, brainLoaded);

//   } else if (key == 'ArrowLeft') {
//     if (modelSelect == 0) {
//       modelSelect = 2;
//     } else {
//       modelSelect -= 1;
//     }
//     console.log('models/' + modelArray[modelSelect] + '/model_meta.json');

//     modelInfo = {
//       model: `models/${modelArray[modelSelect]}/model.json`,
//       metadata: `models/${modelArray[modelSelect]}/model_meta.json`,
//       weights: `models/${modelArray[modelSelect]}/model.weights.bin`,
//     };
//     brain.load(modelInfo, brainLoaded);

//   } else {
//     console.log("press ArrowLeft or ArrowRight")
//     console.log('models/' + modelArray[modelSelect] + '/model_meta.json');
//   }
// }

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
    model: `models/characters/model.json`,
    metadata: `models/characters/model_meta.json`,
    weights: `models/characters/model.weights.bin`,
  };
  brain.load(modelInfo, brainLoaded);
}

function brainLoaded() {
  setTimeout(function () {
    console.log('pose classification ready!');
    classifyPose();
  }, 1000);
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
    setTimeout(classifyPose, 1000);
  }
}

function gotResult(error, results) {
  if (results[0].confidence > 0.96) {
    poseLabel = results[0].label.toUpperCase();
    addVideoElement(poseLabel, "myVideoElement");
    addTextElement(poseLabel);
    var timeout = 1000;
    if (poseLabel == 'FLASH') {
      timeout = 26300;
    }
    if (poseLabel == 'HULK') {
      timeout = 22500;
    }
    if (poseLabel == 'SPIDERMAN') {
      timeout = 32900;
    }
    if (poseLabel == 'WAKANDA FOREVER') {
      timeout = 25000;
    }
    setTimeout(function () {
      classifyPose();
    }, timeout);
  } else {
    poseLabel = "";
    classifyPose();
  }
  // console.log(results[0].confidence);
}

// Call the function to add a video dynamically
// addVideoElement("FLASH", "myVideoElement");
// addTextElement("FLASH");
// addVideoElement("WAKANDA FOREVER", "myVideoElement");
// addTextElement("WAKANDA FOREVER");
// addVideoElement("HULK", "myVideoElement");
// addTextElement("HULK");
// addVideoElement("SPIDERMAN", "myVideoElement");
// addTextElement("SPIDERMAN");

function addVideoElement(poseLabel, videoElementId) {
  // Set the video file path and type
  var videoSource = "videos/" + poseLabel + ".mp4";

  // Get the target video element by its ID
  var video = document.getElementById(videoElementId);

  // Set the video source
  video.src = videoSource;

  // Add an event listener to handle video playback, When the video starts, scroll to section2
  video.addEventListener("play", function () {
    console.log("Video playing...");
    scrollToSection("textBox");
  });

  // When the video ends, scroll back to section1
  video.addEventListener("ended", function () {
    console.log("Video ended playing...");
    scrollToSection("parrentBox");
  });

  // Start the video automatically
  video.play();

  videoSource = "";
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

  var timeout = 1000;
  if (poseLabel == 'FLASH') {
    timeout = 26300;
  }
  if (poseLabel == 'HULK') {
    timeout = 23000;
  }
  if (poseLabel == 'SPIDERMAN') {
    timeout = 32900;
  }
  if (poseLabel == 'WAKANDA FOREVER') {
    timeout = 22000;
  }

  setTimeout(function () {
    myDiv.innerHTML = "Mimic Characters Pose";
    console.log("Text cleared");
  }, timeout);
}

// Function to scroll to a section
function scrollToSection(sectionId) {
  var section = document.getElementById(sectionId);
  // Scroll to the section smoothly
  section.scrollIntoView({ behavior: 'smooth' });
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

  // fill(255, 0, 255);
  // noStroke();
  // textSize(100);
  // textAlign(CENTER, CENTER);
  // text(poseLabel, 100, 100);
}