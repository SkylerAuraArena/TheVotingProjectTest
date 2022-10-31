# TheVotingProject, test version
This is the second Solidity project. Made for Alyra. An upgrade version of the first one in which tests were added using Truffle.

To test this smart contract, I used Truffle, eth-gas-reporter, @openzepplin's contracts and test-helpers. I also used Hardhat because the solidity-coverage library donesn't function on Truffle anymore.

Here are the different types of tests ran as expecting tests : values, reverts and events.

These are made thanks to the test-helpers and chai libraries.

The 34 tests made are gathered according the following groups :
  1-Workflow status modification tests : 11 tests.
  2-Add and Get voters tests : 8 tests.
  3-Add proposals tests with workflow not set on ProposalsRegistrationStarted : 1 test.
  4-Add proposals tests with workflow set on ProposalsRegistrationStarted : 5 tests.
  5-Vote tests with workflow not set on VotingSessionStarted : 2 tests.
  6-Vote tests with workflow set on VotingSessionStarted : 3 tests.
  7-Talling Votes tests with workflow not set on VotesTallied : 2 tests.
  8-Talling Votes tests with workflow set on VotesTallied : 2 tests.
  
 I chose to use only the beforeEach hook since it was the only one I needed. The is no use of only or skip since these are developpment tools and this contract is made for production.
 
To set and check this contract testing :
1.npm install
2.truffle test
 
 Here is the gas consumption report (made with eth-gas-reporter) :
 ·------------------------------------------|----------------------------|-------------|----------------------------·
|   Solc version: 0.8.13+commit.abaa5c0e   ·  Optimizer enabled: false  ·  Runs: 200  ·  Block limit: 6718946 gas  │
···········································|····························|·············|·····························
|  Methods                                                                                                         │
·············|·····························|··············|·············|·············|··············|··············
|  Contract  ·  Method                     ·  Min         ·  Max        ·  Avg        ·  # calls     ·  eur (avg)  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  addProposal                ·       59028  ·      59040  ·      59033  ·          13  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  addVoter                   ·           -  ·          -  ·      50220  ·          37  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  endProposalsRegistering    ·           -  ·          -  ·      30599  ·          10  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  endVotingSession           ·           -  ·          -  ·      30533  ·           5  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  setVote                    ·       58101  ·      78013  ·      63208  ·          10  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  startProposalsRegistering  ·           -  ·          -  ·      94840  ·          24  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  startVotingSession         ·           -  ·          -  ·      30554  ·          10  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  tallyVotes                 ·       37849  ·      63565  ·      53279  ·           5  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Deployments                             ·                                          ·  % of limit  ·             │
···········································|··············|·············|·············|··············|··············
|  Voting                                  ·           -  ·          -  ·    1970015  ·      29.3 %  ·          -  │
·------------------------------------------|--------------|-------------|-------------|--------------|-------------·

Finally, here is the testing covarage made with the Solidity-covarage library. As I previously mentionned, I had to use Hardhat to get that one since It is not compatible with Truffle anymore :
<img width="1668" alt="image" src="https://user-images.githubusercontent.com/42751827/199091910-191a064b-0e5d-45d0-bd3b-52e72b5c9a0d.png">
