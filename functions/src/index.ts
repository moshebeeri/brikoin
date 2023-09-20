const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// import * as plaidFn from "./plaid-functions";
import * as calculator from './operations/calculator';
import * as payments from './payment-functions';
import * as scheduler from './scheduler/scheduler';
import * as groupsTest from './intergrationTest/groupsFlow';
import * as negotiationApiTest from './intergrationTest/negotiationApiTest';

import * as adminTools from './adminTools/tools';
import * as triggerJob from './intergrationTest/triggerJob';
import * as signPdf from './signPdf/signPdfOperation';
import * as invest from './invest-functions';
import * as emails from './email/email-functions';
import * as trader from './orderBook/order-book-functions';
import * as userLedger from './operations/userLedger';
import * as collectionsApi from './operations/collectionsApi';
import * as groupsSearchEngine from './operations/groupsSearchEngine';
import * as auctionTrade from './auctionOrderBook/auction-book';
import * as depositCoins from './operations/depositCoins';
import * as organizationOperations from './operations/orgainzationOperations';
import * as initialProject from './operations/initialProject';
import * as yieldPayment from './operations/yieldPayment';
import * as userSearchEngine from './operations/userSearchEngine';
import * as usersApi from './operations/usersApi';
import * as negotiationApi from './operations/negotiationApi';
import * as bidAsk from './operations/bidAsk';
import * as groups from './operations/groups';
import * as groupsApi from './operations/groupsApi';
import * as projectsSearchEngine from './operations/projectsSearchEngine';
import * as brokerApi from './operations/brokerApi';
import * as projectsApi from './operations/projectsApi';
import * as projectOperation from './operations/projectOperation';
import * as caseApi from './operations/caseApi';
import * as brokerOperations from './operations/brokerOperations';
import * as userOperations from './operations/userOperations';
import * as flexOperations from './flex/flexOperations';
import * as paymentOperations from './payment/paymetOperations';
import * as caseOperations from './operations/caseOperations';
import * as projectManagment from './operations/projectManagment';
import * as internalAccount from './operations/internalAccount';
import * as userDisposition from './operations/userDisposition';
import * as userFeesState from './operations/userFeesState';
import * as mortgageOperations from './operations/mortgageOperations';
import * as collections from './operations/collections';
import * as customerChanels from './operations/customerChanels';
module.exports = {
	...organizationOperations,
	...payments,
	...groups,
	...projectsSearchEngine,
	...negotiationApi,
	...projectOperation,
	...projectsApi,
	...groupsApi,
	...groupsTest,
	...negotiationApiTest,
	...scheduler,
	...signPdf,
	...adminTools,
	...caseApi,
	...userSearchEngine,
	...brokerApi,
	...userLedger,
	...triggerJob,
	...brokerOperations,
	...calculator,
	...collections,
	...userFeesState,
	...userDisposition,
	...mortgageOperations,
	...projectManagment,
	...bidAsk,
	...usersApi,
	...internalAccount,
	...yieldPayment,
	...flexOperations,
	...paymentOperations,
	...groupsSearchEngine,
	...invest,
	...collectionsApi,
	...emails,
	...depositCoins,
	...initialProject,
	...trader,
	...caseOperations,
	...customerChanels,
	...userOperations,
	...auctionTrade
};
