pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/comparators.circom";

template RangeProof(n) {
    assert(n <= 252);
    signal input in; // this is the number to be proved inside the range
    signal input range[2]; // the two elements should be the range, i.e. [lower bound, upper bound]
    signal output out;

    component low = LessEqThan(n);
    component high = GreaterEqThan(n);

    // [assignment] insert your code here
    low.in[0] <== range[0]; //set number to be tested as in[0]
    low.in[1] <== in; //set low range limit at in[1]

    high.in[0] <== range[1]; //set number to be tested as in [0]
    high.in[1] <== in; //Set upper limit as in[1]
//if both are true output will be 1 if one or both of them are false then output will be 0
    out <== high.out*low.out;
}