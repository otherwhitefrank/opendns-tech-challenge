var logger = require('winston');

var log_location = './logs/odns_upload.log';

logger.add(logger.transports.File, { filename: log_location });
logger.info("Logging initiated to console and file  " + log_location );
module.exports=logger;
