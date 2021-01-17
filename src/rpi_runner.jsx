import React, { useRef } from "react";
// import logo from './logo.svg';
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import "./App.css";
import HandTracker from './hand_tracker';
import Light from './light';
import Hand from './hand';
import apiClient from './api_client';
import './jsmpg';

const handleHandMoved = direction => {
  if (direction === 'Up') {
    // apiClient.post('update-brightness', { amount: 15})
    console.log("Increasing brightness");
  } else if (direction === 'Down') {
    // apiClient.post('update-brightness', { amount: -15})
    console.log("Decreasing brightness");
  } else if (direction === 'Left') {
    // console.log("Decreasing Hue");
  } else if (direction === 'Right') {
    // console.log("Increasing Hue");
  }
}

const handTracker = new HandTracker(handleHandMoved);

function RpiRunner() {
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
    const ctx = canvasRef.current.getContext("2d");
    const hand = await net.estimateHands(canvasRef);

    if (!hasPredictedYet) {
      console.log("First prediction");
      hasPredictedYet = true;
    }

    if (hand.length > 0) {
      handTracker.track(hand[0].landmarks, ctx);
      // Hand.draw(hand, ctx)
    }
  };

  runHandpose();

  const client = new WebSocket('ws://' + window.location.hostname + ':${WS_PORT}/');
  const player = new window.jsmpeg(client, {canvas: canvasRef});

  return (
    <div className="App">
      <header className="App-header">
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

export default RpiRunner;
