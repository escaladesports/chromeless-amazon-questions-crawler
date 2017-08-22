'use strict'
require('dotenv').config({ silent: true })
const app = require('./index')
console.log('Running test...')
// https://www.amazon.com/ask/questions/asin/0062472100/1/ref=ask_ql_psf_ql_hza?sort=SUBMIT_DATE
app('0062472100', {
		endpointUrl: process.env.CHROMELESS_ENDPOINT,
		apiKey: process.env.CHROMELESS_API_KEY
	})
	.then(console.log)
	.catch(console.error)

// https://www.amazon.com/ask/questions/asin/B0171P0G3W/1/ref=ask_ql_psf_ql_hza?sort=SUBMIT_DATE
/*
app('B0171P0G3W', {
		endpointUrl: process.env.CHROMELESS_ENDPOINT,
		apiKey: process.env.CHROMELESS_API_KEY
	})
	.then(console.log)
	.catch(console.error)
*/