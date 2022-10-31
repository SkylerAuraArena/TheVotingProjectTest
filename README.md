# **TheVotingProject, test version**
This is the second Solidity project. Made for Alyra. An upgrade version of the first one in which tests were added using Truffle.


--------------------------------------------------------------------------------------------------------------------------------
## **Description :**
 

To test this smart contract, I used Truffle, eth-gas-reporter, @openzepplin's contracts and test-helpers. I also used Hardhat because the solidity-coverage library donesn't function on Truffle anymore.

Here are the different types of tests ran as expecting tests : values, reverts and events.

These are made thanks to the test-helpers and chai libraries.


--------------------------------------------------------------------------------------------------------------------------------
## **Test coverage :**
 

The 34 tests made are gathered according the following groups (functions in the contract) :

  1-Workflow status modification tests : **11 tests**.
  
  2-Add and Get voters tests : **8 tests**.
  
  3-Add proposals tests with workflow not set on ProposalsRegistrationStarted : **1 test**.
  
  4-Add proposals tests with workflow set on ProposalsRegistrationStarted : **5 tests**.
  
  5-Vote tests with workflow not set on VotingSessionStarted : **2 tests**.
  
  6-Vote tests with workflow set on VotingSessionStarted : **3 tests**.
  
  7-Talling Votes tests with workflow not set on VotesTallied : **2 tests**.
  
  8-Talling Votes tests with workflow set on VotesTallied : **2 tests**.
  
  
 I chose to use only the beforeEach hook since it was the only one I needed. The is no use of only or skip since these are developpment tools and this contract is made for production.


--------------------------------------------------------------------------------------------------------------------------------
## **Use :**


To set and check this contract testing :

**1.npm install**

**2.truffle test**

--------------------------------------------------------------------------------------------------------------------------------
## **Optimization :**
 
 
 Here is the gas consumption report (made with eth-gas-reporter) :
<img width="820" alt="image" src="https://user-images.githubusercontent.com/42751827/199092314-e2109e61-5077-4d91-b98b-00f763b8154c.png">

Finally, here is the testing covarage made with the Solidity-covarage library. As I previously mentionned, I had to use Hardhat to get that one since It is not compatible with Truffle anymore :
<img width="1668" alt="image" src="https://user-images.githubusercontent.com/42751827/199091910-191a064b-0e5d-45d0-bd3b-52e72b5c9a0d.png">
