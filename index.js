'use strict'
const Chromeless = require('chromeless').default
const randomUa = require('random-ua')
const evalFunctions = require('amazon-questions-crawler-eval')
const defaultOptions = {
	page: 'https://www.amazon.com/ask/questions/asin/{{asin}}/1/ref=ask_ql_psf_ql_hza?sort=SUBMIT_DATE',
	stopAtQuestionId: false
}

function crawlQuestions(asin, opt) {
	return new Promise((resolve, reject) => {
		opt = Object.assign({}, defaultOptions, opt)
		let result
		new Chromeless({
				remote: {
					endpointUrl: opt.endpointUrl,
					apiKey: opt.apiKey
				}
			})
			.setUserAgent(opt.userAgent || randomUa.generate())
			.goto(opt.page.replace('{{asin}}', asin))
			.wait(evalFunctions.wait.questionBlock)
			.evaluate(evalFunctions.allQuestions, opt)
			.end()
			.then(content => {
				result = content
				// Crawl individual questions pages
				const promises = []
				for (let i = result.questions.length; i--;) {
					promises.push(crawlSinglePage(result.questions[i], opt))
				}
				return Promise.all(promises)
			})
			.then(() => resolve(result))
			.catch(err => {
				if (err.toString().indexOf('TimeoutError') > -1) {
					// No questions
					resolve({
						title: false,
						questions: []
					})
				}
				else{
					reject(err)
				}
			})
	})
}

function crawlSinglePage(obj, opt) {
	return new Promise((resolve, reject) => {
		new Chromeless({
				remote: {
					endpointUrl: opt.endpointUrl,
					apiKey: opt.apiKey
				}
			})
			.setUserAgent(opt.userAgent || randomUa.generate())
			.goto(obj.link)
			.wait(evalFunctions.wait.questionDate)
			.evaluate(evalFunctions.singleQuestion, opt)
			.end()
			.then(data => {
				obj.date = data.date
				obj.author = data.author
				resolve()
			})
			.catch((err) => {
				reject(err)
			})
	})
}

module.exports = crawlQuestions