/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	paidtourpayment:   function(req, res) {
		var TotalAmount = String(req.param('TotalAmount'));
		var MerchantTradeNo = req.param('MerchantTradeNo');
		var newtime = Math.floor(Date.now()/ 1000);
		var email = req.param("email")
		let data = {
			"MerchantID": "MS348104146",
		    "RespondType": "JSON",
		    "TimeStamp": newtime.toString(),
		    "Version": "2.0",
			"MerchantOrderNo": MerchantTradeNo,
			"Amt": TotalAmount,
			"ItemDesc": "TourMeAway Tour Payment",
			"Email": email,
			"NotifyURL": "https://tourmeaway.com/checkout/complete?MerchantTradeNo="+MerchantTradeNo,
			"NotifyURL": "https://tourmeaway.com/checkout/complete?MerchantTradeNo="+MerchantTradeNo,
			"LangType": "en",
			"CREDIT": 1,

		};

		// AES-256-CBC Encrypt
		const crypto = require('crypto');

		let password_hash = "58vDnLFSYdD1cBgRI0pHviqfSc2urOEn";
		//console.log('key=', password_hash);

		// our data to encrypt
		let encdata = new URLSearchParams(data).toString();

		// generate initialization vector
		let iv = "C3vx5ePLXLviGxWP";

		// Create the cipher object
		const cipher = crypto.createCipheriv('aes-256-cbc', password_hash, iv);
		// Encrypt the plaintext
		const encrypted = cipher.update(encdata, 'bin', 'hex');
    	let TradeInfo = encrypted + cipher.final('hex');

		// SHA 256 Encrypt
		let inputdata = "HashKey="+password_hash+"&"+TradeInfo+"&HashIV="+iv;

		const sha256 = crypto.createHash('sha256').update(inputdata);
    	let TradeSha = sha256.digest('hex').toUpperCase();

		// POST
		var request = require('request');
		var querystring = require('querystring');

		var formData = {
		    'MerchantID': 'MS348104146',
		    'Version': '2.0',
		    'TradeInfo': TradeInfo,
		    'TradeSha': TradeSha,
		    'EncryptType':'0'
		};

		var postData = querystring.stringify(formData);
		console.log("postData:" +postData);
		return res.json({ postData: postData });
		request.post(
		    {
		        url: 'https://ccore.newebpay.com/MPG/mpg_gateway',
		        body: postData,
		        headers: {
		            'Content-Type': 'application/x-www-form-urlencoded'
		        }
		    },
		    function (error, response, body) {
		        		// console.log(body);
		            return res.json({ result: body });
		        
		    }
		);
	}
};

