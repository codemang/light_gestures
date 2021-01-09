import React, { useRef } from "react";
// import logo from './logo.svg';
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import "./App.css";
import HandTracker from './hand_tracker';
import Light from './light';
import Hand from './hand';
import apiClient from './api_client';

// import { updateColor, loadLight } from './udp';

let light = undefined;
let light2 = undefined

// loadLight(light2);
//
// Light.lights().then(lights => {
//   light = new Light(lights[0])
// });

const handleHandMoved = direction => {
  if (direction === 'Up') {
    // light.updateBrightness(10);
    // light.increaseBrightness(0.20);
    // apiClient.post('update-brightness', { amount: 10})
    // console.log("Increasing brightness");
  } else if (direction === 'Down') {
    // light.decreaseBrightness(0.20);
    // apiClient.post('update-brightness', { amount: -10})
    // console.log("Decreasing brightness");
  } else if (direction === 'Left') {
    // light.decreaseHue(10);
    // console.log("Decreasing Hue");
  } else if (direction === 'Right') {
    // light.increaseHue(10);
    // console.log("Increasing Hue");
  }
}

const handTracker = new HandTracker(handleHandMoved);

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runHandpose = async () => {
    const net = await handpose.load();
    console.log("Handpose model loaded.");
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 100);
  };

  let hasPredictedYet = false

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const hand = await net.estimateHands(video);
      if (!hasPredictedYet) {
        console.log("First prediction");
        hasPredictedYet = true;
      }
      const ctx = canvasRef.current.getContext("2d");
      // drawHand(hand, ctx);

      if (hand.length > 0) {
        handTracker.track(hand[0].landmarks);
        // Hand.draw(hand, ctx)
      }
    }
  };

  runHandpose();

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;
