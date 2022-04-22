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
	version:6,
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
		console.log(query)	
		const page = await this.browser.newPage();
		await page.goto('https://www.ebay.com/sl/prelist/suggest', {
		waitUntil: 'networkidle0',
	  });
		//finish prelist prompt
		
		const html = await page.$eval('.se-search-box', (e) => e.outerHTML);
		console.log(html)
		 await page.type('#s0-0-0-22-11-keyword-box-input-textbox', query);
		 await page.screenshot({ path: 'public/pre.png' });
		 console.log("clicking button")	
		 await page.click('button.keyword-suggestion__button');
		 await page.waitForTimeout(5000);
		 //click most recommended item
		 await page.screenshot({ path: 'public/rec.png' });
		 const prods = await page.$$('.product-button');
		 if(prods.length>0)
		 	await prods[0].click();
		 await page.waitForTimeout(1000);
		 //select condition
		 await page.click('input[value='+module.exports.conditions[condition]+']');
		 await page.screenshot({ path: 'public/qua.png' });
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