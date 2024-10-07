const logger = require('electron-log');

logger.transports.console.level = 'info';
logger.transports.file.level = 'info';
logger.transports.file.maxSize = 2 * 1024 * 768; // 2M

module.exports = logger;
