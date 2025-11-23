const logger = require("./logger");
let instance = null;

class LooggerClass {
  constructor() {
    if (!instance) {
      instance = this;
    }
    return instance;
  }

  //#mask(message) {return "[PROTECTED DATA]";}

  #crateLogObject(level, email, location, proc_type, log) {
    return {
      level, // Log seviyesi (info, error, warn vb.)
      email, // Kullanıcı emaili
      location, // İşlemin yapıldığı yer
      proc_type, // İşlem tipi
      log, // Log mesajı
    };
  }


  info(email, location, proc_type, log) {
    logger.info(this.#crateLogObject("info", email, location, proc_type, log));
  }

  warn(email, location, proc_type, log) {
    logger.warn(this.#crateLogObject("warn", email, location, proc_type, log));
  }

  error(email, location, proc_type, log) {
    logger.error(
      this.#crateLogObject("error", email, location, proc_type, log)
    );
  }

  verbose(email, location, proc_type, log) {
    logger.verbose(
      this.#crateLogObject("verbose", email, location, proc_type, log)
    );
  }

  silly(email, location, proc_type, log) {
    logger.silly(
      this.#crateLogObject("silly", email, location, proc_type, log)
    );
  }

  http(email, location, proc_type, log) {
    logger.http(this.#crateLogObject("http", email, location, proc_type, log));
  }

  debug(email, location, proc_type, log) {
    logger.debug(
      this.#crateLogObject("debug", email, location, proc_type, log)
    );
  }
}

module.exports = new LooggerClass();
