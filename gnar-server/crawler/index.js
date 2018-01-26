const request = require("request");
const fs = require('fs');
const redis = require('redis');
const cheerio = require("cheerio");
const Nexmo = require('nexmo');

const NEXMO_API_KEY = fs.readFileSync('/run/secrets/nexmo-key', 'utf-8');
const NEXMO_API_SECRET = fs.readFileSync('/run/secrets/nexmo-secret', 'utf-8');
const NEXMO_OPTIONS = { debug: false };
const NEXMO_FROM = '13027224120';
const NEXMO_TO = '+14068616935';
const NEXMO_TEXT = 'A text message sent using the Nexmo SMS API';

// todo make use of redis for storing lift states
var client = redis.createClient('6379', 'redis');
client.on('error', (error) => {
  console.log('error connecting to the redis client');
});

let nexmo = new Nexmo({
  apiKey: NEXMO_API_KEY,
  apiSecret: NEXMO_API_SECRET
}, NEXMO_OPTIONS);

module.exports.crawl = function(){
  request({
    uri: "https://www.mtbachelor.com/conditions-report/",
  }, (error, response, body) => {
    let $ = cheerio.load(body);
    let summitStatus = $('.tab1').find('.list-lifts').children().eq(7).find('.statuses').eq(0).find('.status').eq(0).find('i').attr('class');
    console.log(summitStatus);
    liftStatus(summitStatus);
  });
}


function liftStatus(status){
  if (status === 'icon-status-open'){
    // Nexmo stuff here
    console.log('its open.');
  }
  // else{
  //   console.log('its closed.');
  // }
}

function gnartify(){
  nexmo.message.sendSms(NEXMO_FROM, NEXMO_TO, NEXMO_TEXT, (error, response) => {
    if(error) {
      throw error;
    } else if(response.messages[0].status != '0') {
      console.error(response);
      throw 'Nexmo returned back a non-zero status';
    } else {
      console.log(response);
    }
  });
}
