
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, fluffyCallback) => {
  var id = counter.getNextUniqueId((err, id) => {
    // grab id so we can give it to callback which sends back statuscode
    // create a new file in the data folder
    if (err) {
      fluffyCallback(err, id);
    } else {
      fs.writeFile(exports.dataDir + '/' + id + '.txt', text, (err) =>{
        if (err) {
          fluffyCallback(err, { id, text });
        } else {
          fluffyCallback(null, { id, text });
        }
      });
    }
  });


};

exports.readAll = () => {
  return fs.readdirAsync(exports.dataDir)
    .then(function(files) {
      let promises = files.map(file => {
        return exports.readOneAsync(path.basename(file, '.txt'));
      });
      return Promise.all(promises);
    });
};
// We were so close! I'll see you after lunch. You too.
// (err, files) => { have a good workout hour!!
//   if (err) {
//     callback(err, files);
//   } else {
//     var data = [];
//     files.forEach(file => {
//       data.push({id: path.basename(file, '.txt'), text: path.basename(file, '.txt')});
//     });
//     callback(null, data);
//   }
// });


exports.readOne = (id, callback) => {
  fs.readFile(exports.dataDir + '/' + id + '.txt', (err, fileData) => {
    if (err) {
      callback(err, id);
    } else {
      callback(null, { id, text: fileData.toString() });
    }
  });

};

exports.readOneAsync = Promise.promisify(exports.readOne);

exports.update = (id, text, callback) => {
  fs.readFile(exports.dataDir + '/' + id + '.txt', (err, fileData) => {
    if (err) {
      callback(err, id, fileData);
    } else {
      fs.writeFile(exports.dataDir + '/' + id + '.txt', text, (err) => {
        if (err) {
          callback(err, id, text);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(exports.dataDir + '/' + id + '.txt', (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
