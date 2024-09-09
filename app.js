

// Replace with your contract address and ABI
const contractAddress = '0x0f38ddC770De962C8F16d2A261Bf08DC4FE17f2e';
const contractABI = [
    {  //used for functin 1 i.e. vote
        "constant": false,
        "inputs": [{"name": "option", "type": "uint256"}],
        "name": "vote",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    { //used for functin 2 i.e. getVoteCount
        "constant": true,
        "inputs": [{"name": "option", "type": "uint256"}],
        "name": "getVoteCount",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

const web3 = new Web3(Web3.givenProvider);
const contract = new web3.eth.Contract(contractABI, contractAddress);

async function vote() {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (!selectedOption) {
        alert('Please select an option to vote.');
        return;
    }

    const option = parseInt(selectedOption.value);
    try {
        const accounts = await web3.eth.getAccounts();
        const sender = accounts[0];
        if (!sender) {
            alert('Please connect your Ethereum account.');
            return;
        }

        await contract.methods.vote(option).send({ from: sender });
        alert('Vote submitted successfully!');
        updateVoteCounts(); //to update vote count
    } catch (error) {
        console.error('Error submitting vote:', error);
        alert('Failed to submit vote. Please check the console for details.');
    }
}

async function updateVoteCounts() {
const voteOptions = ['BTECH', 'MTECH', 'PHD', 'MSC', 'MCA'];
const voteList = document.getElementById('voteList');
voteList.innerHTML = ''; // Clear previous vote counts
    try {
        for (let i = 0; i < voteOptions.length; i++) {
            const voteCount = await contract.methods.getVoteCount(i).call(); // access the getVoteCount function
            const optionLabel = voteOptions[i];
            const listItem = document.createElement('li');
            listItem.textContent = `${optionLabel} : ${voteCount} votes`;
            voteList.appendChild(listItem);
        }
        } catch (error) {
            console.error('Error retrieving vote counts:', error);
            // Optionally, you can display an error message to the user
            voteList.innerHTML = '<li>Error retrieving vote counts. Please try again later.</li>';
        }
}
// Initial update of vote counts when the page loads
updateVoteCounts();
