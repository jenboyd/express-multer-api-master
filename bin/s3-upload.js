'use strict';

const fs = require('fs');
const fileType = require('file-type');

const filename = process.argv[2] || '';

const readFile = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (error, data) => {
      if (error) {
        reject(error);
      }
      resolve(data);
    });
  });
};

//return a default object in the case fileType is given an unsupported.
//filetype to read.
const mimeType = (data) => {
  return Object.assign({
    ext: 'bin',
    mime: 'application/octet-stream',
  }, fileType(data));
};

const parseFile = (fileBuffer) => {
  let file = mimeType(fileBuffer);
  file.data = fileBuffer;
  return file;
};

const upload = (file) => {
  const options = {
    //get bucket name from AWS console
    Bucket: 'jenniferboyd',
    //attach the fileBuffer as a stream to send to Amazon.
    Body: file.data,
    //allow anyone to access the URL of the uploaded file
    ACL: 'public-read',
    //tell s3 what the mime-type is
    contentType: file.mime,
    //pick a filename for S3 to use for the upload
    key: `test/test.$file.ext`
  };
  return Promise.resolve(options);
};

//don't actually upload yet, just pass the data down the Promise chain
const logMessage = (upload) => {
  delete upload.body;
  console.log(`the upload options are ${JSON.stringify(upload)}`);
};

readFile(filename)
.then(parseFile)
.then(upload)
.then(logMessage)
.catch(console.error)
;
