const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');


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

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err, files);
    } else {
      var data = [];
      files.forEach(file => {
        data.push({id: path.basename(file, '.txt'), text: path.basename(file, '.txt')});
      });
      callback(null, data);
    }
  });

};

exports.readOne = (id, callback) => {
  fs.readFile(exports.dataDir + '/' + id + '.txt', (err, fileData) => {
    if (err) {
      callback(err, id);
    } else {
      // var deBuffered = fileData.toString();
      callback(null, { id, text: fileData.toString() });
      // NOTE FOR TOMORROW
      // we need the file data to go from a buffered state to a readable object
      // I agree. I remember this .toString being used for the chunks in the chatterbox server sprint, but I'm not sure if that's what brought it into useable form.
    } // yeah i remember that too i thought i just json.parsed it but its still not working but we can try tostring tomorrow
    //Ok good plan. :)
  });

};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
