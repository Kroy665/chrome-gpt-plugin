// import jwt from 'jsonwebtoken';
var CryptoJS = require("crypto-js");

const  decryptToken = (token) => {
    try {
        var bytes  = CryptoJS.AES.decrypt(token, process.env.REACT_APP_JWT_SECRET);
        var decryptedToken = bytes.toString(CryptoJS.enc.Utf8);
        return decryptedToken;
    } catch (error) {
        return false;
    }
};

const encryptToken = (token) => {
    // console.log(token);
    var encryptedToken = CryptoJS.AES.encrypt(token, process.env.REACT_APP_JWT_SECRET).toString();
    localStorage.setItem('encryptedToken', encryptedToken);
    return encryptedToken;
};


export {
    decryptToken,
    encryptToken
};