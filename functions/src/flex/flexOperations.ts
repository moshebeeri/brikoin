const functions = require('firebase-functions')
const admin = require('firebase-admin')
const AccessToken = require('twilio').jwt.AccessToken
const VideoGrant = AccessToken.VideoGrant

const accountSid = 'ACde9becade1257930f33203e0cfaaa26d';
const authToken = 'b05780609ebf102e89da27a3785b4d46';
const client = require('twilio')(accountSid, authToken);

import { } from '../operations/utils'
const ChatGrant = AccessToken.ChatGrant;

exports.flexVideoToken = functions.database.ref(`server2/operations/events/flexVideoTokenTrigger`).onWrite(async (change, context) => {

})

const express = require('express');
const cors = require('cors');

const app = express();
const router = express.Router();              // get an instance of the express Router

router.use((req, res, next) => {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});
// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use('/', router);
router.route('/token/:identify')

// create a bear (accessed at POST http://localhost:8080/api/bears)
    .post( (req, res) =>  {
        let identify =  req.params.identify
        console.log(identify)
        let db = admin.database()
        // Create an access token which we will sign and return to the client,
        // containing the grant we just created
        let token = new AccessToken(
            'ACde9becade1257930f33203e0cfaaa26d',
            'SK85e7a31c2e5c92b9982b5ee92cf481b3',
            'jMOUpsb5IfSJrQkFam6o2E3MzltX0QYD'
        );

        // Assign the generated identity to the token
        token.identity = identify;

        const grant = new VideoGrant();
        // Grant token access to the Video API features
        token.addGrant(grant);
        const tokenJwt = token.toJwt()
        res.set('Access-Control-Allow-Origin', '*')
        res.status(200).send({data:{token: tokenJwt}});

    })
router.route('/chatToken/:identify/:deviceId')

// create a bear (accessed at POST http://localhost:8080/api/bears)
    .post( (req, res) =>  {
        const appName = 'TwilioChat';
        console.log('CREATING CHAT TOKEN 2')
        // Create a unique ID for the client on their current device
        const endpointId = appName + ':' +  req.params.identify + ':' + req.params.deviceId;

        // Create a "grant" which enables a client to use Chat as a given user,
        // on a given device
        const chatGrant = new ChatGrant({
            serviceSid: 'ISec7d8fa67e9741e0ae2607fd024f0163',
            endpointId: endpointId,
        });

        // Create an access token which we will sign and return to the client,
        // containing the grant we just created
        let token = new AccessToken(
            'ACde9becade1257930f33203e0cfaaa26d',
            'SK85e7a31c2e5c92b9982b5ee92cf481b3',
            'jMOUpsb5IfSJrQkFam6o2E3MzltX0QYDx'
        );

        token.addGrant(chatGrant);
        token.identity = req.params.identify;
        const tokenJwt = token.toJwt()
        console.log('TOKEN ' + tokenJwt)
        res.set('Access-Control-Allow-Origin', '*')
        res.status(200).send({data:{token: tokenJwt}});

    })
router.route('/taskVideo/:roomName/:clientId')

// create a bear (accessed at POST http://localhost:8080/api/bears)
    .post( async (req, res) =>  {
        console.log(`creating Task: ${ req.params.roomName} / ${ req.params.clientId}`)
        console.log('CREATING VIDEO TASK 2')
        console.log(accountSid + ' ' + 'WS682d1bb75e15d856a81592f746786152')
        let task = await client.taskrouter.workspaces('WS682d1bb75e15d856a81592f746786152')
            .tasks
            .create({     workflowSid: "WW0f132a384db2aa29c8a6d35244aedc10",
                attributes: JSON.stringify({
                type: 'video',

                roomName: req.params.roomName,
                clientId: req.params.clientId,

            })})
        console.log(`Task created Successfully ${task.sid}`)
        res.status(200).send({data:{task: task.sid}});

    })
router.route('/taskChat/:channelSid/:clientId')

// create a bear (accessed at POST http://localhost:8080/api/bears)
    .post( async (req, res) =>  {
        console.log('CREATING CHAT TASK 3')
        let task = await client.taskrouter.workspaces('WS682d1bb75e15d856a81592f746786152')
            .tasks
            .create({
                    taskChannel:'TC51e594c48f616d65e3e80023202be7dd',
                     workflowSid: "WW0f132a384db2aa29c8a6d35244aedc10",
                attributes: JSON.stringify({
                    channelType: 'default',
                    channelSid: req.params.channelSid,
                    name: req.params.clientId,
                    roomForVideo: req.params.channelSid

                })
                }
                )
        console.log(`Task created Successfully ${task.sid}`)
        res.status(200).send({data:{task: task.sid}});

    })


// Expose Express API as a single Cloud Function:
exports.flex = functions.https.onRequest(app);

