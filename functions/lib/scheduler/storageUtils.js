"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require('firebase-functions');
const fileBucket = functions.config().file.bucket;
const admin = require('firebase-admin');
function makeCopy(sourceFile) {
    return __awaiter(this, void 0, void 0, function* () {
        const bucket = admin.storage().bucket(fileBucket);
        let startFilePath = sourceFile.substring(0, sourceFile.lastIndexOf('.'));
        console.log(`startFilePath ${startFilePath}`);
        let endFilePath = sourceFile.substring(sourceFile.lastIndexOf('.') + 1);
        console.log(`endFilePath ${endFilePath}`);
        let newFilePath = `${startFilePath}-Copy-${new Date().getTime()}.${endFilePath}`;
        console.log(`newFilePath ${newFilePath}`);
        yield bucket.file(sourceFile).copy(bucket.file(newFilePath));
        return newFilePath;
    });
}
exports.makeCopy = makeCopy;
//# sourceMappingURL=storageUtils.js.map