'use strict'
const Chromeless = require('chromeless').default
const randomUa = require('random-ua')
const evalFunctions = require('amazon-questions-crawler-eval')
const defaultOptions = {
	page: 'https://www.amazon.com/ask/questions/asin/{{asin}}/1/ref=ask_ql_psf_ql_hza?sort=SUBMIT_DATE',
	stopAtQuestionId: false
}

module.exports = (asin, opt) => {
	return new Promise((resolve, reject) => {
		opt = Object.assign({}, defaultOptions, opt)
		let result
		const chromeless = new Chromeless({
				remote: {
					endpointUrl: opt.endpointUrl,
					apiKey: opt.apiKey
				},
				waitTimeout: 2000
			})
		chromeless.setUserAgent(opt.userAgent || randomUa.generate())
			.goto(opt.page.replace('{{asin}}', asin))
			.evaluate(evalFunctions.allQuestions, opt)
			.end()
			.then(resolve)
			.catch(err => {
				chromeless.end()
				if (err.toString().indexOf('timed out') > -1) {
					// No questions
					resolve({
						title: false,
						questions: []
					})
				}
				else {
					reject(err)
				}
			})
	})
}