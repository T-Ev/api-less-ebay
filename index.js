const puppeteer =require('puppeteer')
const fetch =require('node-fetch')

module.exports = {
	conditions:{
		"New":1000,
		"Open Box":1500,
		"Used":3000,
		"For Parts or Not Working":7000
	},
	browser:null,
	version:1,
	init: async function(){
		this.browser = await puppeteer.launch({
			args: ['--no-sandbox', '--disable-setuid-sandbox','--disable-gpu'],
			dumpio: true
		});
	},
	end: async function(){
		await browser.close();
	},
	getKey: async function(){
		console.log("getting key")
	},
	confirmKey: async function(ota){
		if(ota){

		}
	},
	listItem: async function(query, condition){		
		const page = await this.browser.newPage();
		await page.goto('https://www.ebay.com/sl/prelist/suggest', {
		waitUntil: 'networkidle0',
	  });
		//finish prelist prompt
		await page.screenshot({ path: 'public/pre.png' });
		 await page.type('#s0-0-0-22-11-keyword-box-input-textbox', query);		
		 await page.click('button[data-ebayui]');
		 await page.waitForTimeout(5000);
		 //click most recommended item
		 await page.click('.product-button:first-of-type');
		 await page.waitForTimeout(1000);
		 //select condition
		 await page.click('input[value='+module.exports.conditions[condition]+']');
		 //navigate to full listing
		 await page.waitForTimeout(1000);
		 await page.click('.condition-dialog-radix__continue-btn');
		 
		 //await page.type('.product-button:first-of-type', 'Toronto, ON');
		 //add photos
		 //
		await page.waitForTimeout(5000); // wait for 5 seconds
		await page.screenshot({ path: 'public/example.png' });
		return true;

	},
	queryUPC: async function(upc){
		if(upc && upc.length==12){
			let res = await fetch("https://api.upcitemdb.com/prod/trial/lookup?upc="+upc).then(data=>data.json())
			res = res.items;
			return {
				raw:res,
				query: res.brand+" "+res.model+" "+res.color+" "+res.size,

			}
		} else {
			throw new Error("Invalid UPC")
		}
	},
	puppeteer:puppeteer
}