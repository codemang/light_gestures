const LifxClient = require('node-lifx').Client;
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

const togglePower = light => {
  light.getState((error, state) => {
    if (state.power === 1) {
      light.off(300);
    } else {
      light.color(state.color.hue, state.color.saturation, 100, 3500, 0); // Fading the light on over two seconds
      light.on(300);
    }
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

module.exports = { loadLight, updateColor, updateBrightness, togglePower };
