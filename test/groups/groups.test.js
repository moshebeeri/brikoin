const ProjectGroups = artifacts.require("./ProjectGroups.sol");
const Web3 = require("web3");
const AssetManager = artifacts.require("./AssetManager.sol");
const StoneCoin = artifacts.require("./StoneCoin.sol");
const ProjectGroupsStorage = artifacts.require(
  "./storage/ProjectGroupsStorage.sol"
);
const ProjectGroupsVotingStorage = artifacts.require(
  "./storage/ProjectGroupsVotingStorage.sol"
);
contract("Groups Test", function(accounts) {
  let projectGroups = null;
  let assetManager = null;
  let projectGroupsStorage = null;
  let projectGroupsVotingStorage = null;
  const user0 = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];
  const user3 = accounts[3];
  const user4 = accounts[4];
  before(async () => {
    assetManager = await AssetManager.new({ from: user1 });
    let assetManagerddress = await assetManager.getAddress();
    await assetManager.addProjectDocument("TRUSTEE", "test", { from: user1 });
    await assetManager.addProjectOfficial("TRUSTEE", user3, { from: user1 });
    let stoneCoinContract = await StoneCoin.new(
      "Test",
      "Test",
      20000,
      1000,
      10000,
      assetManagerddress,
      "url",
      "urlm",
      false,
      1,
      { from: user1 }
    );
    let stoneCoinAdfress = await stoneCoinContract.getAddress();
    projectGroups = await ProjectGroups.new(stoneCoinAdfress, user1, false, {
      from: user1
    });
    projectGroupsStorage = await ProjectGroupsStorage.new({ from: user1 });
    projectGroupsVotingStorage = await ProjectGroupsVotingStorage.new({
      from: user1
    });
    let projectGroupsVotingStorageAddress = await projectGroupsVotingStorage.getAddress();
    let projectGroupsStorageAddress = await projectGroupsStorage.getAddress();
    let projectGroupAddress = await projectGroups.getAddress();
    await projectGroupsStorage.addOwnership(projectGroupAddress, {
      from: user1
    });
    await projectGroupsStorage.addOwnership(projectGroupsVotingStorageAddress, {
      from: user1
    });
    await projectGroupsVotingStorage.setProjectGroupStorageAddress(
      projectGroupsStorageAddress,
      { from: user1 }
    );
    await projectGroupsVotingStorage.addOwnership(projectGroupAddress, {
      from: user1
    });
    await projectGroupsVotingStorage.addOwnership(projectGroupsStorageAddress, {
      from: user1
    });
    await projectGroups.setProjectGroupsStorage(projectGroupsStorageAddress, {
      from: user1
    });
    await projectGroups.setProjectGroupsVotingStorage(
      projectGroupsVotingStorageAddress,
      { from: user1 }
    );
    await projectGroups.init({ from: user1 });
  });
  it("invite group test", async () => {
    await projectGroups.inviteMember(user2, { from: user1 });
    await projectGroups.joinGroup({ from: user2 });
    await projectGroups.inviteMember(user3, { from: user1 });
    await projectGroups.joinGroup({ from: user3 });
    await projectGroups.inviteMember(user4, { from: user1 });
    await projectGroups.joinGroup({ from: user4 });
    let members = await projectGroups.getMembers({ from: user2 });
    // let amount = await signedDocument.getSignatureCount()
    assert.equal(members.length, 4, `should be 2 members `);
  });
  it("leave group test", async () => {
    await projectGroups.leaveGroup({ from: user2 });
    let members = await projectGroups.getMembers({ from: user2 });
    // let amount = await signedDocument.getSignatureCount()
    assert.equal(members.length, 3, `should be 1 members`);
  });
  it("test offer", async () => {
    await projectGroups.joinGroup({ from: user2 });
    await projectGroups.setOffer(10000, { from: user2 });
    await projectGroups.setOffer(20000, { from: user1 });
    console.log(`get offer`);
    let offer = await projectGroups.getOffer({ from: user2 });
    let offerUser1 = await projectGroups.getOffer({ from: user1 });
    console.log(`offer : ${JSON.stringify(offer)}`);
    console.log(`offerUser1 : ${JSON.stringify(offerUser1)}`);
    assert.equal(parseInt(offer), 10000, `should be 10000`);
    assert.equal(parseInt(offerUser1), 20000, `should be 20000`);
  });
  it("should vote failed", async () => {
    // bid
    try {
      await projectGroups.vote("test", true, { from: user2 });
      assert(false);
    } catch (error) {
      assert(true);
    }
  });
  it("test vote failed", async () => {
    try {
      await projectGroups.setVotingType("test", "MAJOR", { from: user1 });
      await projectGroups.paymentStatus(user4, 100, true, { from: user3 });
      await projectGroups.vote("test", true, { from: user2 });
      assert(false);
    } catch (error) {
      assert(true);
    }
  });
  it("test vote", async () => {
    await projectGroups.setVotingType("test", "MAJOR", { from: user1 });
    await projectGroups.paymentStatus(user2, 0, true, { from: user3 });

    await projectGroups.vote("test", true, { from: user2 });
    console.log(`get offer`);
    let results = await projectGroups.getVotingResult("test", { from: user2 });
    let numberOfVoters = await projectGroups.getNumberOfVoters("test", {
      from: user2
    });
    let numberOfPositiveVoters = await projectGroups.getVotingPositiveResult(
      "test",
      { from: user2 }
    );
    let votingType = await projectGroups.getVotingType("test", { from: user1 });

    assert.equal(parseInt(results), 10000, `should be 10000`);
    assert.equal(parseInt(numberOfVoters), 1, `should be 1`);
    assert.equal(parseInt(numberOfPositiveVoters), 1, `should be 1`);
    assert.equal(votingType, "MAJOR", `should be MAJOR`);
  });

  it("test vote 2", async () => {
    await projectGroups.paymentStatus(user3, 0, true, { from: user3 });
    await projectGroups.vote("test", true, { from: user1 });
    await projectGroups.setOffer(15000, { from: user3 });
    await projectGroups.vote("test", false, { from: user3 });
    console.log(`get offer`);
    let results = await projectGroups.getVotingResult("test", { from: user2 });
    console.log(`getVotingResult: ${results}`);
    let numberOfVoters = await projectGroups.getNumberOfVoters("test", {
      from: user2
    });
    console.log(`numberOfVoters: ${numberOfVoters}`);
    let numberOfPositiveVoters = await projectGroups.getVotingPositiveResult(
      "test",
      { from: user2 }
    );
    console.log(`numberOfPositiveVoters: ${numberOfPositiveVoters}`);
    assert.equal(parseInt(results), 30000, `should be 10000`);
    assert.equal(parseInt(numberOfVoters), 3, `should be 3`);
    assert.equal(parseInt(numberOfPositiveVoters), 2, `should be 2`);
  });

  it("should vote failed already voted", async () => {
    // bid
    try {
      await projectGroups.vote("test", true, { from: user2 });
      assert(false);
    } catch (error) {
      assert(true);
    }
  });

  it("test vote failed", async () => {
    try {
      await projectGroups.setVotingType("test", "MAJOR", { from: user1 });
      await projectGroups.paymentStatus(user4, 100, true, { from: user3 });
      await projectGroups.vote("test", true, { from: user2 });
      assert(false);
    } catch (error) {
      assert(true);
    }
  });

  it("test group Representation should fail", async () => {
    // bid
    try {
      await projectGroups.addGroupRepresentation(user2, { from: user1 });
      assert(false);
    } catch (error) {
      assert(true);
    }
  });

  it("test group Representation", async () => {
    console.log(`start Representation: `);
    await projectGroups.addGroupRepresentation(user2, { from: user3 });
    let result = await projectGroups.isGroupRepresentative(user2, {
      from: user2
    });
    console.log(`isGroupRepresentative user2: ${result}`);
    await projectGroups.addGroupRepresentation(user3, { from: user3 });
    let groupRepresentation = await projectGroups.getGroupRepresentation({
      from: user2
    });
    console.log(
      `result Representation:  ${JSON.stringify(groupRepresentation)}`
    );
    assert.equal(groupRepresentation.length, 2, `should be 2`);
  });
});
