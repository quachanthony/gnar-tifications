// Get external dependencies
// const mongoose = require('mongoose');
// Get internal dependencies
require('./server');
const crawler = require('./crawler');
const cron = require('cron').CronJob;


/*
* Runs every day (Monday through Sunday)
* at 9:00:00 AM.
*/
// const START_TIME = '00 00 9 * 10-4 0-6';
const START_TIME = '00 30 17 * * 0-6';
/*
* stops every day (Monday through Sunday)
* at 4:00:00 PM.
*/
const STOP_TIME = '00 00 16 * 10-4 0-6'

let job = new cron(START_TIME, function() {
		// 10 minute interval
		// const INTERVAL = 600000;
		const INTERVAL = 30000;
		setInterval(function() {
		    // crawl the site
			crawler.crawl();
		}, INTERVAL); 
  	}, function () {
		/* This function is executed when the job stops */
  	},
    true, /* Start the job right now */
    'America/Los_Angeles' /* Time zone of this job. */
);

let stop = new cron(STOP_TIME, function() {
		/*
		* Runs every day (Monday through Sunday)
		* at 9:00:00 AM.
		*/
		job.stop();
    }, function () {
		/* This function is executed when the job stops */
  	},
    true, /* Start the job right now */
    'America/Los_Angeles' /* Time zone of this job. */
);


