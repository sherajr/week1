const fs = require("fs");
const solidityRegex = /pragma solidity \^\d+\.\d+\.\d+/

const verifierRegex1 = /contract Verifier/
const verifierRegex2 = /contract HelloWorldVerifier/

let content = fs.readFileSync("./contracts/HelloWorldVerifier.sol", { encoding: 'utf-8' });
let bumped = content.replace(solidityRegex, 'pragma solidity ^0.8.0');
bumped = bumped.replace(verifierRegex1, 'contract HelloWorldVerifier');

fs.writeFileSync("./contracts/HelloWorldVerifier.sol", bumped);

// [assignment] add your own scripts below to modify the other verifier contracts you will build during the assignment

let solread = fs.readFileSync("./contracts/Multiplier3Verifier.sol", { encoding: 'utf-8'});
let upgrade = solread.replace(solidityRegex, 'pragma solidity ^0.8.0');
upgrade = upgrade.replace(verifierRegex1, 'contract Multiplier3Verifier');

fs.writeFileSync("./contracts/Multiplier3Verifier.sol", upgrade);

/* let solread2 = fs.readFileSync("./contracts/_plonkMultiplier3Verifier.sol", { encoding: 'utf-8'});
let upgrade2 = solread2.replace(solidityRegex, 'pragma solidity ^0.8.0');
upgrade2 = upgrade2.replace(verifierRegex, 'contract _plonkMultiplier3Verifier');

fs.writeFileSync("./contracts/_plonkMultiplier3Verifier.sol", bumped); */