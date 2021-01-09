const LifxClient = require('node-lifx').Client;
// import { Client } from 'node-lifx';
const client = new LifxClient();
const _ = require('lodash');

client.init();

const loadLight = (name, callback) => {
  client.on('light-new', function(light) {
    light.getState((error, state) => {
      if (state.label === name) {
        callback(light);
      }
    })
  });
};

const updateBrightness = (light, amount) => {
  light.getState((error, state) => {
    let brightness = state.color.brightness + amount
    brightness = _.max([brightness, 0]);
    brightness = _.min([brightness, 100]);

    light.color(state.color.hue, state.color.saturation, brightness, 3500, 350); // Fading the light on over two seconds
  })
};

const updateColor = (light, args) => {
  light.getState((error, state) => {
    if (state.label !== 'Nate') {
      return
    }

    light.color(...args)
  });
};

module.exports = { loadLight, updateColor, updateBrightness };


// client.on('light-new', function(light) {
//
//   light.getState((error, state) => {
//     if (state.label !== 'Nate') {
//       return
//     }
//     console.log("Here")
//
//     console.log(state.color);
//     let counter = 0;
//
//     const func = () => {
//       counter += 1;
//       // console.log(light.color);
//       // console.log((10 - counter) * 10)
//       console.log(counter);
//       light.color(state.color.hue, state.color.saturation, (10 - counter) * 10, 3500, 500); // Fading the light on over two seconds
//     };
//
//     setInterval(func.bind(this), 500)
//   });
//   // console.log("Done")
//   // Change light state here
// });
