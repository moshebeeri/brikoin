const functions = require('firebase-functions')
const admin = require('firebase-admin')

exports.ocr = functions.database.ref(`server/operations/ocr/document`).onWrite(async (document) => {
    let db = admin.database();
    try {
        let operation = await nextOperation();
        if (operation) {
            let key = Object.keys(operation)[0]
            operation[key].executed = true;

            let executionPath = db.ref('server').child('operations').child('project').child('initialOffer').child(key);
            executionPath.set(operation[key]);
        }
    } catch (error) {
        log(JSON.stringify(error))
    }
});


async function nextOperation() {
    let nextOperation = await getNextOperation();
    return nextOperation
}

function getNextOperation() {
    return new Promise((resolve, reject) => {
        try {
            const db = admin.database();
            db.ref(`server/operations/ocr/document`).orderByChild("executed").equalTo(false).limitToFirst(1).on("value", function (snapshot) {
                resolve(snapshot.val());

            })
        }
        catch (error) {
            reject(error)
        }
    })
}

function log(message) {
    console.log(message)
}

