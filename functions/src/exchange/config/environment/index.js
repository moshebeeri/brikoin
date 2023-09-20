'use strict'

import path from 'path'
import _ from 'lodash'

// ============================================
const all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(`${__dirname}/../../..`),

  ethereum: {
    testnet: true,
    chainId: process.env.CHAIN_ID || 557888
  }
}

module.exports = _.merge(
  all,
  require('./shared'),
  require(`./${process.env.NODE_ENV}.js`) || {})
