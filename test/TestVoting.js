const Voting = artifacts.require("./Voting.sol");
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
 
contract("Voting", accounts => {
    const owner = accounts[0];
    const secondAddress = accounts[1];
    const thirdAddress = accounts[2];
    const fourthAddress = accounts[3];

    let VotingTestInstance;

    describe("Workflow status changes tests", function () {

        beforeEach(async function () {
            VotingTestInstance = await Voting.new({ from: owner });
        });

        it("...should return the current workflow status which is to be 0 (RegisteringVoters) after initialization", async () => {
            const status = await VotingTestInstance.workflowStatus.call();
            expect(status).to.be.bignumber.equal(new BN(0));
        });     

        it("...should change the current workflow status from 0 to 1 and get the WorkflowStatusChange event", async () => {
            const newStatusEvent = await VotingTestInstance.startProposalsRegistering();
            expectEvent(newStatusEvent,"WorkflowStatusChange" ,{previousStatus: new BN(0), newStatus: new BN(1)});
        });   

        it("...should return the new current workflow status which is to be 1 (ProposalsRegistrationStarted)", async () => {
            await VotingTestInstance.startProposalsRegistering();
            const status = await VotingTestInstance.workflowStatus.call();
            expect(status).to.be.bignumber.equal(new BN(1));
        });        

        it("...should return the new current workflow status which is to be 2 (ProposalsRegistrationEnded)", async () => {
            await VotingTestInstance.startProposalsRegistering();
            await VotingTestInstance.endProposalsRegistering();
            const status = await VotingTestInstance.workflowStatus.call();
            expect(status).to.be.bignumber.equal(new BN(2));
        });    

        it("...should return the new current workflow status which is to be 3 (VotingSessionStarted)", async () => {
            await VotingTestInstance.startProposalsRegistering();
            await VotingTestInstance.endProposalsRegistering();
            await VotingTestInstance.startVotingSession();
            const status = await VotingTestInstance.workflowStatus.call();
            expect(status).to.be.bignumber.equal(new BN(3));
        });        

        it("...should return the new current workflow status which is to be 4 (VotingSessionEnded)", async () => {
            await VotingTestInstance.startProposalsRegistering();
            await VotingTestInstance.endProposalsRegistering();
            await VotingTestInstance.startVotingSession();
            await VotingTestInstance.endVotingSession();
            const status = await VotingTestInstance.workflowStatus.call();
            expect(status).to.be.bignumber.equal(new BN(4));
        });        

        it("...should return the new current workflow status which is to be 5 (VotesTallied)", async () => {
            await VotingTestInstance.startProposalsRegistering();
            await VotingTestInstance.endProposalsRegistering();
            await VotingTestInstance.startVotingSession();
            await VotingTestInstance.endVotingSession();
            await VotingTestInstance.tallyVotes();
            const status = await VotingTestInstance.workflowStatus.call();
            expect(status).to.be.bignumber.equal(new BN(5));
        }); 
        
        it("...should revert when trying to change the current workflow status from 0 (RegisteringVoters) to 2 (ProposalsRegistrationStarted)", async () => {
            await expectRevert(VotingTestInstance.endProposalsRegistering(), "Registering proposals havent started yet");
        });        
        
        it("...should revert when trying to change the current workflow status from 0 (RegisteringVoters) to 3 (VotingSessionStarted)", async () => {
            await expectRevert(VotingTestInstance.startVotingSession(), "Registering proposals phase is not finished");
        });   
        
        it("...should revert when trying to change the current workflow status from 0 (RegisteringVoters) to 4 (VotingSessionEnded)", async () => {
            await expectRevert(VotingTestInstance.endVotingSession(), "Voting session havent started yet");
        });   
        
        it("...should revert when trying to change the current workflow status from 0 (RegisteringVoters) to 5 (VotesTallied)", async () => {
            await expectRevert(VotingTestInstance.tallyVotes(), "Current status is not voting session ended");
        });   
    });

    describe("Add voters tests", function () {

        beforeEach(async function () {
            VotingTestInstance = await Voting.new({ from: owner });
        });

        it("...should revert when registering an address without being the contract owner", async () => {
            await expectRevert(VotingTestInstance.addVoter(secondAddress, { from: secondAddress }), "caller is not the owner");
        });

        it("...should revert when trying to get a voter's informations but the caller is not a registered voter", async () => {
            await expectRevert(VotingTestInstance.getVoter(owner), "You're not a voter");
        });

        it("...should add the first address as a new voter then get event voter added with the address[0]", async () => {
            const addedVoter = await VotingTestInstance.addVoter(owner, { from: owner });
            expectEvent(addedVoter,"VoterRegistered" ,{voterAddress: owner});
        });

        it("...should add a new voter then get the default proposal description", async () => {
            await VotingTestInstance.addVoter(owner, { from: owner });
            await VotingTestInstance.startProposalsRegistering();
            const addedProposal = await VotingTestInstance.getOneProposal(0);
            expect(addedProposal.description).to.equal("GENESIS");
        });

        it("...should return true (registered) when the address[0] has been added as the first registered voter and the caller is a registered voter", async () => {
            await VotingTestInstance.addVoter(owner, { from: owner });
            const addedVoter = await VotingTestInstance.getVoter(owner);
            expect(addedVoter.isRegistered).to.be.equal(true);
        });

        it("...should revert when registering the address[0] which has already been registered", async () => {
            await VotingTestInstance.addVoter(owner, { from: owner });
            await expectRevert(VotingTestInstance.addVoter(owner, { from: owner }), "Already registered");
        });

        it("...should return false (not registered) when the contract is asked for the address[1] which has not been previously registered", async () => {
            await VotingTestInstance.addVoter(owner, { from: owner });
            const addedVoter = await VotingTestInstance.getVoter(secondAddress);
            expect(addedVoter.isRegistered).to.be.equal(false);
        });

        it("...should revert trying to register a new voter whereas voters registration in not opened", async () => {
            await VotingTestInstance.addVoter(owner, { from: owner });
            await VotingTestInstance.startProposalsRegistering();
            await expectRevert(VotingTestInstance.addVoter(secondAddress, { from: owner }), "Voters registration is not open yet");
        });
    });

    describe("Add proposals tests with workflow not set on ProposalsRegistrationStarted", function () {
        it("...should revert when trying to register a new proposal whereas proposals registration is not allowed", async () => {
            VotingTestInstance = await Voting.new({ from: owner });
            await VotingTestInstance.addVoter(owner, { from: owner });
            await VotingTestInstance.addVoter(secondAddress, { from: owner });
            await expectRevert(VotingTestInstance.addProposal("First", { from: owner }), "Proposals are not allowed yet");
        });
    });

    describe("Add proposals tests with workflow set on ProposalsRegistrationStarted", function () {

        beforeEach(async function () {
            VotingTestInstance = await Voting.new({ from: owner });
            await VotingTestInstance.addVoter(owner, { from: owner });
            await VotingTestInstance.addVoter(secondAddress, { from: owner });
            await VotingTestInstance.startProposalsRegistering();
        });

        it("...should revert when a non-registered address tries to get a proposal's informations", async () => {
            await expectRevert(VotingTestInstance.getOneProposal(new BN(0), { from: fourthAddress }), "You're not a voter");
        });

        it("...should add a new proposal as the second voter and get the ProposalRegistered event", async () => {
            const addedProposal = await VotingTestInstance.addProposal("First", { from: secondAddress });
            expectEvent(addedProposal,"ProposalRegistered" ,{proposalId: new BN(1)});
        });

        it("...should add a new proposal described as 'First' and get this new proposal description", async () => {
            await VotingTestInstance.addProposal("First", { from: owner });
            const addedProposal = await VotingTestInstance.getOneProposal(1);
            expect(addedProposal.description).to.equal("First");
        });

        it("...should add a new proposal and get this new proposal vote counts as 0", async () => {
            await VotingTestInstance.addProposal("First", { from: owner });
            const addedProposal = await VotingTestInstance.getOneProposal(1);
            expect(new BN(addedProposal.voteCount)).to.be.bignumber.equal(new BN(0));
        });

        it("...should revert when the new proposal's description is an empty string", async () => {
            await expectRevert(VotingTestInstance.addProposal("", { from: secondAddress }),"Vous ne pouvez pas ne rien proposer");
        });
    });

    describe("Vote tests with workflow not set on VotingSessionStarted", function () {

        beforeEach(async function () {
            VotingTestInstance = await Voting.new({ from: owner });
        });

        it("...should revert when a non-registered address tries to vote", async () => {
            await expectRevert(VotingTestInstance.setVote(0), "You're not a voter");
        });

        it("...should revert when trying to vote whereas voting session is not on going", async () => {
            await VotingTestInstance.addVoter(owner, { from: owner });
            await expectRevert(VotingTestInstance.setVote(0), "Voting session havent started yet");
        });
    });

    describe("Vote tests with workflow set on VotingSessionStarted", function () {

        beforeEach(async function () {
            VotingTestInstance = await Voting.new({ from: owner });
            await VotingTestInstance.addVoter(owner, { from: owner });
            await VotingTestInstance.addVoter(secondAddress, { from: owner });
            await VotingTestInstance.startProposalsRegistering();
            await VotingTestInstance.addProposal("Second", { from: secondAddress });
            await VotingTestInstance.endProposalsRegistering();
            await VotingTestInstance.startVotingSession();
        });

        it("...should vote and get the Voted event", async () => {
            const voteRegistered = await VotingTestInstance.setVote(0, { from: owner });
            expectEvent(voteRegistered,"Voted" ,{voter: owner, proposalId: new BN(0)});
        });

        it("...should revert when a voter tries to vote whereas he has prviously voted", async () => {
            await VotingTestInstance.setVote(0, { from: owner });
            await expectRevert(VotingTestInstance.setVote(0, { from: owner }), "You have already voted");
        });

        it("...should revert when the vote id is out of the proposals' array bounds", async () => {
            await expectRevert(VotingTestInstance.setVote(3, { from: owner }), "Proposal not found");
        });
    });

    describe("Talling Votes tests with workflow not set on VotesTallied", function () {

        beforeEach(async function () {
            VotingTestInstance = await Voting.new({ from: owner });
        });

        it("...should revert when trying to tally votes whereas the voting session has not ended", async () => {
            await expectRevert(VotingTestInstance.tallyVotes({ from: owner }), "Current status is not voting session ended");
        });

        it("...should return the winning proposal id which is to be 0 on initialization", async () => {
            const winningProposalId = await VotingTestInstance.winningProposalID.call();
            expect(new BN(winningProposalId)).to.be.bignumber.equal(new BN(0));
        });
    });

    describe("Talling Votes tests with workflow set on VotesTallied", function () {

        beforeEach(async function () {
            VotingTestInstance = await Voting.new({ from: owner });
            await VotingTestInstance.addVoter(owner, { from: owner });
            await VotingTestInstance.addVoter(secondAddress, { from: owner });
            await VotingTestInstance.addVoter(thirdAddress, { from: owner });
            await VotingTestInstance.startProposalsRegistering();
            await VotingTestInstance.addProposal("Second", { from: secondAddress });
            await VotingTestInstance.addProposal("Third", { from: thirdAddress });
            await VotingTestInstance.endProposalsRegistering();
            await VotingTestInstance.startVotingSession();
            await VotingTestInstance.setVote(2, { from: owner });
            await VotingTestInstance.setVote(2, { from: secondAddress });
            await VotingTestInstance.setVote(2, { from: thirdAddress });
            await VotingTestInstance.endVotingSession();
            await VotingTestInstance.tallyVotes();
        });

        it("...should revert when an address which is not the owner tries to tally the votes", async () => {
            await expectRevert(VotingTestInstance.tallyVotes({ from: secondAddress }), "caller is not the owner");
        });

        it("...should return the winning proposal id which is to be 2 when votes are tallied", async () => {
            const winningProposalId = await VotingTestInstance.winningProposalID.call();
            expect(new BN(winningProposalId)).to.be.bignumber.equal(new BN(2));
        });
    });
});