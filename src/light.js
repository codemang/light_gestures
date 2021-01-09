import lifxClient from './lifx_client';
import _ from 'lodash';

class Light {
  constructor(lightMetadata) {
    this.lightMetadata = lightMetadata;
  }

  static lights() {
    return lifxClient.get('lights/all').then(res => res.data);
  }

  turnOn() {
    return this.updateState({ power: 'on' }).then(res => {
      this.lightMetadata.power = 'on';
    });
  }

  turnOff() {
    return this.updateState({ power: 'off' }).then(res => {
      this.lightMetadata.power = 'off';
    });
  }

  increaseBrightness(amount) {
    const brightness = _.min([(this.lightMetadata.brightness + amount), 1])
    this.lightMetadata.brightness = brightness;

    return this.updateState({ brightness })
  }

  decreaseBrightness(amount) {
    const brightness = _.max([(this.lightMetadata.brightness - amount), 0.2])
    this.lightMetadata.brightness = brightness;

    return this.updateState({ brightness })
  }

  increaseHue(amount) {
    return this.updateHue((this.lightMetadata.color.hue + amount) % 360)
  }

  decreaseHue(amount) {
    let hue = this.lightMetadata.color.hue - amount;

    if (hue < 0) {
      hue += 360;
    }

    return this.updateHue(hue)
  }

  updateHue(hue) {
    this.lightMetadata.color.hue = hue;
    return this.updateState({ color: { hue }})
  }

  updateState(state) {
    return lifxClient.put(`lights/id:${this.lightMetadata.id}/state`, state);
  }
};

export default Light;
