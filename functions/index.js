const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.sendNotificationToTopic = functions.firestore.document('puppies/{uid}').onWrite(async (event) => {
    //let docID = event.after.id;
    let title = event.after.get('title');
    let content = event.after.get('content');
    var message = {
        notification: {
            title: title,
            body: content,
        },
        topic: 'namelesscoder',
    };

    let response = await admin.messaging().send(message);
    console.log(response);
});

exports.sendNotificationToFCMToken = functions.firestore.document('messages/{mUid}').onWrite(async (event) => {
    const uid = event.after.get('userUid');
    const title = event.after.get('title');
    const content = event.after.get('content');
    let userDoc = await admin.firestore().doc(`users/${uid}`).get();
    let fcmToken = userDoc.get('fcm');

    var message = {
        notification: {
            title: title,
            body: content,
        },
        token: fcmToken,
    }

    let response = await admin.messaging().send(message);
    console.log(response);
});