'use strict'
require('dotenv').config({ silent: true })
const app = require('./index')
console.log('Running test...')
app('0062472100', {
		endpointUrl: process.env.CHROMELESS_ENDPOINT,
		apiKey: process.env.CHROMELESS_API_KEY
	})
	.then(console.log)
	.catch(console.error)