const functions = require('firebase-functions');
// var functions = require('firebase-functions')
const { Storage } = require('@google-cloud/storage');
const projectId = 'karmanila69-f7a2a';
const axios = require('axios'); 
const serverKey = require('./serverKey');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
let database = admin.database();

const os = require('os');
const path = require('path');
const spawn = require('child-process-promise').spawn;
const cors = require('cors')({origin: true});
const Busboy = require('busboy');
const fs = require('fs')

const gcconfig = {
    projectId,
    keyFilename: "karmanila69-f7a2a-firebase-adminsdk-9s5di-d5002e52f6.json",
    databaseURL: "https://karmanila69-f7a2a.firebaseio.com"
};

let gcs = new Storage ({
    gcconfig
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.uploadFileResize = functions.https.onRequest((req, res) => { 
    cors(req, res, () => {
        if(req.method !== 'POST') {
            return res.status(500).json({
                message: 'not allowed'
            })
        } 

        // console.log(res,'res')
        
        const busboy = new Busboy({headers: req.headers})
        let uploadData = null;
        let folder = ''
        let size = ''

        busboy.on('field', (fieldname, val) => {
            if(fieldname === 'folder'){
                folder = val
            } else {
                size = val
            }
        });
        
        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            const filepath = path.join(os.tmpdir(), filename);

            uploadData = {
                file: filepath,
                type: mimetype
            };

            file.pipe(fs.createWriteStream(filepath))

        });

        busboy.on('finish', ()=> {
            const bucket = gcs.bucket('karmanila69-f7a2a.appspot.com')
            //'500x500\>'
            return spawn('convert', ['-auto-orient',uploadData.file, '-resize', size+'\>' , uploadData.file])
            .then(() => {

                return  bucket.upload(uploadData.file, {
                            uploadType: 'media', 
                            resumable: false,
                            metadata: {
                                metadata: {
                                    contentType: uploadData.type
                                }
                            },
                            predefinedAcl: 'publicRead',
                            destination: folder + path.basename(uploadData.file)
                        })
            }).then(result => {
                const file = result[0];
                return file.getMetadata();
            }).then(results => {
                const metadata = results[0];
                // console.log('metadata=', metadata);
                return metadata.mediaLink;
            }).then(link =>{
                res.status(200).json({
                    message: 'It worked :)',
                    link: link,
                    folder: folder,
                    size: size
                });
            }).catch(err => {
                // console.log('error',err)
                res.status(500).json({
                    message: 'error',
                    error: err.toString()
                });
            });

        });
        busboy.end(req.rawBody)

    });
});
