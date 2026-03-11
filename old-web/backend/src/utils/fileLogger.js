const fs = require('fs');
const path = require('path');

class FileLogger {
  constructor() {
    this.logsDir = path.join(process.cwd(), 'logs');
    this.ensureLogsDirectory();
  }

  ensureLogsDirectory() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  getLogFileName(type = 'app') {
    const date = new Date().toISOString().split('T')[0];
    return path.join(this.logsDir, `${type}-${date}.log`);
  }

  formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...(data && { data })
    };
    return JSON.stringify(logEntry) + '\n';
  }

  writeLog(level, message, data = null, logType = 'app') {
    try {
      const logFile = this.getLogFileName(logType);
      const formattedMessage = this.formatMessage(level, message, data);
      fs.appendFileSync(logFile, formattedMessage, 'utf8');
    } catch (error) {
      console.error('Failed to write to log file:', error.message);
    }
  }

  info(message, data = null, logType = 'app') {
    this.writeLog('INFO', message, data, logType);
  }

  warn(message, data = null, logType = 'app') {
    this.writeLog('WARN', message, data, logType);
  }

  error(message, data = null, logType = 'app') {
    this.writeLog('ERROR', message, data, logType);
  }

  request(message, data = null) {
    this.writeLog('REQUEST', message, data, 'request');
  }

  response(message, data = null) {
    this.writeLog('RESPONSE', message, data, 'response');
  }
}

module.exports = new FileLogger();
