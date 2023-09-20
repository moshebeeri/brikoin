// const SimpleStorage = artifacts.require('./SimpleStorage.sol')
// const TutorialToken = artifacts.require('./TutorialToken.sol')
// const ComplexStorage = artifacts.require('./ComplexStorage.sol')
// const Test = artifacts.require('./Test.sol')
// const CornerTest2 = artifacts.require('./CornerTest2.sol')

const MortgageeCondition = artifacts.require(
  "./structures/MortgageeCondition.sol"
);
const MortgageRequest = artifacts.require("./structures/MortgageRequest.sol");
const Estimation = artifacts.require("./structures/Estimation.sol");
const EstimationFactory = artifacts.require("./factory/EstimationFactory.sol");
const MortgageFactory = artifacts.require("./factory/MortgageFactory.sol");
const VotingFactory = artifacts.require("./factory/VotingFactory.sol");
const ManagerFactory = artifacts.require("./factory/ManagerFactory.sol");
const AssetFactory = artifacts.require("./factory/AssetFactory.sol");
const TrusteeFactory = artifacts.require("./factory/TrusteeFactory.sol");
const TokenApproveFactory = artifacts.require(
  "./factory/TokenApproveFactory.sol"
);
const RegistrarFactory = artifacts.require("./factory/RegistrarFactory");
const TermsFactory = artifacts.require("./factory/TermsFactory");
const PropertyFactory = artifacts.require("./factory/PropertyFactory");
const SignedDocumentFactory = artifacts.require(
  "./factory/SignedDocumentFactory"
);
const MortgageRequestFactory = artifacts.require(
  "./factory/MortgageRequestFactory"
);
const StoneCoinFactory = artifacts.require("./factory/StoneCoinFactory.sol");
const OrganizationFactory = artifacts.require(
  "./factory/OrganizationFactory.sol"
);
const CornerStoneBaseStorage = artifacts.require(
  "./storage/CornerStoneBaseStorage.sol"
);
const StoneCoinMortgageStorage = artifacts.require(
  "./storage/StoneCoinMortgageStorage.sol"
);
const MortgageStoneStorage = artifacts.require(
  "./storage/MortgageStoneStorage.sol"
);
const AggregateStoneCoinFactory = artifacts.require(
  "./factory/AggregateStoneCoinFactory.sol"
);
const Manager = artifacts.require("./structures/Manager.sol");
const Voting = artifacts.require("./structures/Voting.sol");
const Disposition = artifacts.require("./structures/Disposition.sol");
const BrokerManager = artifacts.require("./structures/BrokerManager.sol");
const TradesHistory = artifacts.require("./structures/TradesHistory.sol");
const FeeManager = artifacts.require("./structures/FeeManager.sol");
const Trustee = artifacts.require("./structures/Trustee.sol");
const Registrar = artifacts.require("./structures/Registrar.sol");
const Terms = artifacts.require("./structures/Terms.sol");
const Property = artifacts.require("./structures/Property.sol");
const Organization = artifacts.require("./structures/Organization.sol");
const TokenApproveContract = artifacts.require(
  "./structures/TokenApproveContract.sol"
);
const CornerStoneBase = artifacts.require("./CornerStoneBase.sol");
const CornerStone = artifacts.require("./CornerStone.sol");
const AggregatedStoneCoins = artifacts.require("./AggregatedStoneCoins.sol");
const MortgageOperations = artifacts.require("./MortgageOperations.sol");
const MortgageStone = artifacts.require("./MortgageStone.sol");
const StoneCoin = artifacts.require("./StoneCoin.sol");
const CornerTransaction = artifacts.require("./CornerTransaction.sol");
const StoneCoinMortgage = artifacts.require("./StoneCoinMortgage.sol");
const StoneCoinStorage = artifacts.require("./StoneCoinStorage.sol");
const AssetManager = artifacts.require("./AssetManager.sol");
const Project = artifacts.require("./Project.sol");
const ProjectGroups = artifacts.require("./ProjectGroups.sol");
const ProjectGroupsStorage = artifacts.require(
  "./storage/ProjectGroupsStorage.sol"
);
const ProjectGroupsVotingStorage = artifacts.require(
  "./storage/ProjectGroupsVotingStorage.sol"
);
const Mortgage = artifacts.require("./Mortgage.sol");
const States = artifacts.require("./structures/States.sol");

module.exports = function(deployer, network, accounts) {
  // Use the accounts within your migrations.
  console.log(`2_deploy_contracts.js`);

  // see https://github.com/trufflesuite/truffle/issues/43

  deployer.deploy(Organization, "name", "phone", "email");

  deployer.deploy(AggregatedStoneCoins, "name", "phone", 0, 0, 0, 0, 0);
  const voting = deployer.deploy(
    Voting,
    11,
    "holdingYears",
    "sellPercentage",
    new Date().getTime() + 10000000
  );

  const p6 = deployer.deploy(
    StoneCoin,
    "TestCoin",
    "TECO",
    10000000,
    Date.now() / 1000,
    10000,
    10,
    "httpL//test",
    "4sgd4tedfgdf",
    true,
    1
  );

  deployer.deploy(ProjectGroups, 0, 0, false);
  deployer.deploy(StoneCoinMortgage);
  deployer.deploy(CornerTransaction);
  deployer.deploy(OrganizationFactory);
  deployer.deploy(AggregateStoneCoinFactory);
  deployer.deploy(StoneCoinStorage);
  deployer.deploy(ProjectGroupsStorage);
  deployer.deploy(ProjectGroupsVotingStorage);
  deployer.deploy(MortgageStoneStorage);
  deployer.deploy(StoneCoinMortgageStorage);
  deployer.deploy(CornerStoneBaseStorage);
  deployer.deploy(TokenApproveFactory);
  deployer.deploy(MortgageRequestFactory);
  deployer.deploy(VotingFactory, "VotingFactory");
  deployer.deploy(MortgageFactory);
  deployer.deploy(Project, "Project");
  deployer.deploy(EstimationFactory, "EstimationFactory");
  deployer.deploy(SignedDocumentFactory, "SignedDocumentFactory");
  deployer.deploy(ManagerFactory, "ManagerFactory");
  deployer.deploy(TrusteeFactory, "TrusteeFactory");
  deployer.deploy(TermsFactory, "TermsFactory");
  deployer.deploy(RegistrarFactory, "RegistrarFactory");
  deployer.deploy(PropertyFactory, "PropertyFactory");
  deployer.deploy(AssetFactory, "AssetFactory");
  deployer.deploy(
    Property,
    "name",
    "100",
    "1",
    "2",
    "3",
    "country",
    "address1",
    "address2",
    "state",
    "lat",
    "lon"
  );

  deployer
    .deploy(CornerStoneBase)
    .catch(err => console.log(`Error deploying CornerStone ${err.message}`));
  deployer
    .deploy(Disposition)
    .catch(err => console.log(`Error deploying CornerStone ${err.message}`));
  deployer
    .deploy(BrokerManager)
    .catch(err => console.log(`Error deploying CornerStone ${err.message}`));
  deployer
    .deploy(FeeManager)
    .catch(err => console.log(`Error deploying CornerStone ${err.message}`));
  deployer
    .deploy(MortgageOperations)
    .catch(err => console.log(`Error deploying CornerStone ${err.message}`));
  deployer
    .deploy(TradesHistory)
    .catch(err => console.log(`Error deploying CornerStone ${err.message}`));

  deployer
    .deploy(CornerStone)
    .catch(err => console.log(`Error deploying CornerStone ${err.message}`));
  deployer
    .deploy(MortgageStone)
    .catch(err => console.log(`Error deploying CornerStone ${err.message}`));
  deployer
    .deploy(AssetManager)
    .catch(err => console.log(`Error deploying CornerStone ${err.message}`));

  const p8 = deployer.deploy(
    MortgageeCondition,
    1131,
    true,
    111,
    111,
    1000000000,
    1000000,
    1000000,
    24,
    24,
    1,
    1,
    12
  );

  const p9 = deployer.deploy(
    MortgageRequest,
    1131,
    111,
    2,
    11,
    1,
    1000000000,
    1000000,
    1000000,
    false
  );
  deployer.deploy(Mortgage, 1, accounts[0], accounts[1], 1, 1, false);

  deployer.deploy(TokenApproveContract, 1, 2, 2, 4, 5);
  deployer.deploy(States, 1);
};
