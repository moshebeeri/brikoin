const States = artifacts.require("./structures/States.sol");

let TestUtils = require("../testUtils");

contract("states", function(accounts) {
  let states = null;
  const admin = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];

  before(async () => {
    states = await States.new(1, { from: admin });
  });

  function tuppleToObj(tupple) {
    return {
      name: tupple[0],
      executor: tupple[1],
      executed: tupple[2],
      isValue: tupple[3]
    };
  }

  it("should have create states", async () => {
    await states.addState("state_1", user1);
    await states.addState("state_2", user1);
    await states.addState("state_3", user1);
    await states.addState("state_4", user1);
    await states.finalize();
    const next = await states.getNextState();
    const state = tuppleToObj(next);
    console.log(JSON.stringify(tuppleToObj(next)));
    assert.equal(state.name, "state_1", `state name should be state_1`);
  });

  it("should fail for changes after finalization", async () => {
    try {
      await states.addState("state_5", user1);
      assert.equal(true, false, "add state after finalize should fail");
    } catch (error) {
      assert.equal(true, true, "add state failed as expected");
    }
  });

  it("should advance to last state", async () => {
    let next, state;

    await states.advanceState(1);
    next = await states.getNextState();
    state = tuppleToObj(next);
    assert.equal(state.name, "state_2", `state name should be state_2`);
    await states.advanceState(1);
    next = await states.getNextState();
    state = tuppleToObj(next);
    assert.equal(state.name, "state_3", `state name should be state_3`);
    await states.advanceState(1);
    next = await states.getNextState();
    state = tuppleToObj(next);
    assert.equal(state.name, "state_4", `state name should be state_4`);
    await states.advanceState(1);

    try {
      await states.getNextState();
      assert.equal(true, false, "error - should fail - no more states left");
    } catch (error) {
      assert.equal(true, true, "fail - no more states left");
    }
  });

  it("should be last state", async () => {
    const isLast = await states.isLastState();
    assert.equal(isLast, true, "should be last state");
  });
});
