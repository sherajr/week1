const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { groth16 } = require("snarkjs");
const { plonk } = require("snarkjs");

function unstringifyBigInts(o) {
    if ((typeof(o) == "string") && (/^[0-9]+$/.test(o) ))  {
        return BigInt(o);
    } else if ((typeof(o) == "string") && (/^0x[0-9a-fA-F]+$/.test(o) ))  {
        return BigInt(o);
    } else if (Array.isArray(o)) {
        return o.map(unstringifyBigInts);
    } else if (typeof o == "object") {
        if (o===null) return null;
        const res = {};
        const keys = Object.keys(o);
        keys.forEach( (k) => {
            res[k] = unstringifyBigInts(o[k]);
        });
        return res;
    } else {
        return o;
    }
}

describe("HelloWorld", function () {
    let Verifier;
    let verifier;

    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("HelloWorldVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] Add comments to explain what each line is doing
        const { proof, publicSignals } = await groth16.fullProve({"a":"1","b":"2"}, "contracts/circuits/HelloWorld/HelloWorld_js/HelloWorld.wasm","contracts/circuits/HelloWorld/circuit_final.zkey");
        //the line above waits to fully prove groth16 true using the inputs a=1 b=2 and the .wasm .zkey files that were generated 
        console.log('1x2 =',publicSignals[0]);
        //the line above writes down "1x2= the answer"
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        //converts public signals json into constant for solidity
        const editedProof = unstringifyBigInts(proof);
        //converts proof from json to constant for solidity
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
        //creates calldata constant for solidity to use
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
        //creates an associative array of argument values by reformatting data taking 
        //symbols out and splitting between commas.
        const a = [argv[0], argv[1]];
        //assigns first two values of argv array to input a
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        //assigns 3rd-6th argv values to input b
        const c = [argv[6], argv[7]];
        //assigns 7th and 8th argv value to input c
        const Input = argv.slice(8);
        //creates string input of 8 last characters from argv

        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
        //checks to see if the proof is delcared true
    });
    it("Should return false for invalid proof", async function () {
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
        //If all values are zero, the same or invalid, the proof should be false
    });
});


describe("Multiplier3 with Groth16", function () {
    let Verifier;
    let verifier;
    beforeEach(async function () {
        //[assignment] insert your script here
        Verifier = await ethers.getContractFactory("Multiplier3Verifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] insert your script here
        const { proof, publicSignals } = await groth16.fullProve({"in1":"1","in2":"2","in3":"3"}, "contracts/circuits/Multiplier3/Multiplier3_js/Multiplier3.wasm","contracts/circuits/Multiplier3/circuit_final.zkey");
        //the line above waits to fully prove groth16 true using the inputs a=1 b=2 c=3 and the .wasm .zkey files that were generated 
        console.log('1x2x3 =',publicSignals[0]);
        //the line above writes down "1x2x3= the answer"
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        //converts public signals json into constant for solidity
        const editedProof = unstringifyBigInts(proof);
        //converts proof from json to constant for solidity
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
        //creates calldata constant for solidity to use
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
        //creates an associative array of argument values
        const a = [argv[0], argv[1]];
        //assigns first two values of argv array to input a
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        //assigns 3rd-6th argv values to input b
        const c = [argv[6], argv[7]];
        
        const Input = argv.slice(8);
        //creates string input of 8 last characters from argv

        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
        //checks to see if the proof is delcared true
    });
    it("Should return false for invalid proof", async function () {
        //[assignment] insert your script here
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
        //If all values are zero, the same or invalid, the proof should be false
    });
});


describe("Multiplier3 with PLONK", function () {
    let Verifier;
    let verifier;
    beforeEach(async function () {
        //[assignment] insert your script here
        Verifier = await ethers.getContractFactory("contracts/_plonkMultiplier3Verifier.sol:PlonkVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] insert your script here
        const { proof, publicSignals } = await plonk.fullProve({"in1":"1","in2":"2","in3":"3"}, "contracts/circuits/_plonkMultiplier3/_plonkMultiplier3_js/_plonkMultiplier3.wasm","contracts/circuits/_plonkMultiplier3/circuit.zkey");

        console.log('1x2x3 =',publicSignals[0]);
    });
    it("Should return false for invalid proof", async function () {
        //[assignment] insert your script here
        let a = "0x00";
        let d = ['0'];
        expect(await verifier.verifyProof(a, d)).to.be.false;
    });
});
