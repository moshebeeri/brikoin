const SignedDocument = artifacts.require("../structures/SignedDocument.sol");
let TestUtils = require("../testUtils");

contract("Signed Documen t", function(accounts) {
  let signedDocument = null;
  let signedDocumenWihAdmin2 = null;
  const user0 = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];
  const user3 = accounts[3];

  before(async () => {
    signedDocument = await SignedDocument.new(
      false,
      "http://someUrl/23123FFB",
      "983ac672e9d5300ab00a1fe2569da8c2",
      { from: user1 }
    );
    signedDocumenWihAdmin2 = await SignedDocument.new(
      true,
      "http://someUrl/23123FFB",
      "983ac672e9d5300ab00a1fe2569da8c2",
      { from: user1 }
    );
  });

  it("should have no singers", async () => {
    let amount = await signedDocument.getSignatureCount();
    assert.equal(amount.valueOf(), 0, `should has no signers`);
  });

  it("should declare signers", async () => {
    let result = await signedDocument.shouldSign(user2, "TRUSTEE", {
      from: user1
    });
    assert.equal(
      TestUtils.validateReceipt(result, "ShouldSign", { by: user2 }),
      true,
      "User should be registered for sign"
    );
    result = await signedDocument.isSigneer(user2);
    assert.equal(result, true, "User should be signer");
  });

  it("should signed", async () => {
    let result = await signedDocument.sign({ from: user2 });
    assert.equal(
      TestUtils.validateReceipt(result, "Sign", { by: user2 }),
      true,
      "User should sign"
    );
    result = await signedDocument.isSignedBy(user2);
    assert.equal(result, true, "User should be signed");
    result = await signedDocument.isSign();
    assert.equal(result, true, "Document should be totally signed");
  });

  it("should declare signers admin", async () => {
    let result = await signedDocumenWihAdmin2.shouldSign(user2, "TRUSTEE", {
      from: user1
    });
    assert.equal(
      TestUtils.validateReceipt(result, "ShouldSign", { by: user2 }),
      true,
      "User should be registered for sign"
    );
    result = await signedDocumenWihAdmin2.isSigneer(user2);
    assert.equal(result, true, "User should be signer");
  });

  it("should signed", async () => {
    let result = await signedDocumenWihAdmin2.sign({ from: user2 });
    assert.equal(
      TestUtils.validateReceipt(result, "Sign", { by: user2 }),
      true,
      "User should sign"
    );
    result = await signedDocumenWihAdmin2.isSignedBy(user2);
    assert.equal(result, true, "User should be signed");
    result = await signedDocumenWihAdmin2.isSign();
    assert.equal(result, false, "Document should be totally signed");

    result = await signedDocumenWihAdmin2.shouldSign(user1, "ADMIN", {
      from: user1
    });
    assert.equal(
      TestUtils.validateReceipt(result, "ShouldSign", { by: user1 }),
      true,
      "User should be registered for sign"
    );
    result = await signedDocumenWihAdmin2.isSigneer(user1);
    assert.equal(result, true, "User should be signer");
    result = await signedDocumenWihAdmin2.sign({ from: user1 });
    assert.equal(
      TestUtils.validateReceipt(result, "Sign", { by: user1 }),
      true,
      "User should sign"
    );
    result = await signedDocumenWihAdmin2.isSign();
    assert.equal(result, true, "Document should be totally signed");
  });
});
