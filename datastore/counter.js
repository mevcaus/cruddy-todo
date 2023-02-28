const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');

    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (fancyCallback) => {
  // counter = counter + 1;
  // return zeroPaddedNumber(counter);
  // read what current counter is
  // turn that into a Number
  // readCounter // store this number somewhere
  // readCounter(function () => {writeCounter(arg1, arg2)})
  // zero Pad
  // return that number?

  //callback == ???? <==== We pass this in on line in index.

  // callback(null, updatedNumber); <==== We call this at the end of this function.
  readCounter((err, numberBeingRead) => {
    if (err) {
      // we'll never get here because readCounter always returns null as first arg
      fancyCallback(err, numberBeingRead);
    } else {
      const updatedNumber = numberBeingRead + 1;
      writeCounter(updatedNumber, (err, counterString) => {
        if (err) {
          // do somethings
          fancyCallback(err, counterString);

        } else {
          // const newId = zeroPaddedNumber(updatedNumber);
          fancyCallback(null, counterString);
        }
      });
    }
    // callback()
  });
  // ????? Update the counter file?
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
