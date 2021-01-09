import Hand from './hand';

const BUFFER_SIZE = 5;

const linearRegression = (y,x) => {
  var lr = {};
  var n = y.length;
  var sum_x = 0;
  var sum_y = 0;
  var sum_xy = 0;
  var sum_xx = 0;
  var sum_yy = 0;

  for (var i = 0; i < y.length; i++) {

    sum_x += x[i];
    sum_y += y[i];
    sum_xy += (x[i]*y[i]);
    sum_xx += (x[i]*x[i]);
    sum_yy += (y[i]*y[i]);
  }

  lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
  lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
  lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

  return lr;
}

const average = (array) => array.reduce((a, b) => a + b) / array.length;

const cumDiff = arr => {
  let diff = 0;

  for (var i = 0; i < (arr.length - 1); i++) {
    diff += arr[i] - arr[i + 1]
  }

  return diff;
}

class HandTracker {
  constructor(handleHandMoved) {
    this.palmLocationBuffer = []
    this.palmMovementSlopeBuffer = [];
    this.handleHandMoved = handleHandMoved;
  }

  track(hand) {
    if (Hand.isOpen(hand) !== 1) {
      return;
    }

    this.palmLocationBuffer.push(hand[0])

    if (this.palmLocationBuffer.length <= 3) {
      return;
    }


    if (this.palmLocationBuffer.length > BUFFER_SIZE) {
      this.palmLocationBuffer.shift();
    }

    console.log(this.palmLocationBuffer[4][1] - this.palmLocationBuffer[3][1])

    const palmYs = this.palmLocationBuffer.map(elm => elm[1]);
    const palmXs = this.palmLocationBuffer.map(elm => elm[0]);
    const palmMovementSlope = Math.abs(linearRegression(palmYs, palmXs).slope);

    this.palmMovementSlopeBuffer.push(palmMovementSlope);

    if (this.palmMovementSlopeBuffer.length < BUFFER_SIZE) {
      return;
    }

    if (this.palmMovementSlopeBuffer.length > BUFFER_SIZE) {
      this.palmMovementSlopeBuffer.shift();
    }

    const palmMovementSlopeAverage = average(this.palmMovementSlopeBuffer);

    // Most likely vertical hand movement.
    if (palmMovementSlopeAverage > 1) {
      const palmYCumDiff = cumDiff(this.palmLocationBuffer.map(elm => elm[1]));

      // This is the number of pixels the palm has moved. It should be large,
      // if it's less than 20 than it's likely not purposeful motion.
      if (Math.abs(palmYCumDiff) < 20) {
        return;
      }

      if (palmYCumDiff > 0) {
        this.handleHandMoved('Up');
      } else {
        this.handleHandMoved('Down');
      }
    // Most likely horizontal hand movement.
    } else if (palmMovementSlopeAverage < 0.2) {
      const palmXCumDiff = cumDiff(this.palmLocationBuffer.map(elm => elm[0]));

      // This is the number of pixels the palm has moved. It should be large,
      // if it's less than 20 than it's likely not purposeful motion.
      if (Math.abs(palmXCumDiff) < 20) {
        return;
      }

      if (palmXCumDiff > 0) {
        this.handleHandMoved('Right');
      } else {
        this.handleHandMoved('Left');
      }
    }
  }
};

export default HandTracker;
