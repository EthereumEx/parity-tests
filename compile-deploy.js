const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');

const dest_account = '0x002D61B362ead60A632c0e6B43fCff4A7a259285';

// Connect to local Ethereum node
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

// Compile the source code
const input = fs.readFileSync('Token.sol');
const output = solc.compile(input.toString(), 1);
//console.log(output.contracts['Token']);
//console.log(output.formal.errors);
const bytecode = output.contracts['Token'].bytecode;
const abi = JSON.parse(output.contracts['Token'].interface);

// Contract object
const contract = web3.eth.contract(abi);

// Contract instance
const contractInstance = contract.new({
    data: '0x' + bytecode,
    from: web3.eth.coinbase,
    gas: 1000000
}, (err, res) => {
    if (err) {
        console.log(err);
        return;
    }

    console.log(res.transactionHash);

    if (res.address) {
        console.log('Contract address: ' + res.address);
        testContract(res.address);
    }
});

// Quick test the contract

function testContract(address) {
    const token = contract.at(address);
    const balance1 = token.balances.call(web3.eth.coinbase);
    console.log(balance1);
    console.log(balance1 == 1000000);
    token.transfer(dest_account, 100, {from: web3.eth.coinbase}, (err, res) => {
        console.log('tx: ' + res);
        const balance2 = token.balances.call(dest_account);
        console.log(balance2);
        console.log(balance2 == 100);
    });
}
