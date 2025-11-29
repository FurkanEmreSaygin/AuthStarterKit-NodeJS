const Enum = require('../config/Enum');
const CustomError = require('./Error');
const config = require('../config');
const i18n = new (require('./i18n'))(config.DEFAULT_LANG);
class Response {
  constructor() {}

  static successResponse(data, code = 200) {
    return {
      code,
      data,
    };
  }

  static errorResponse(error, lang) {
    if (!lang) lang = "en";
    if (error instanceof CustomError) {
      return {
        code: error.code,
        error: {
          message: error.message,
          description: error.description || null,
        },
      };
    }

    if (error.code === 11000) {
      return {
        code: Enum.HTTP_CODES.CONFLICT || 409,
        error: {
          message: i18n.translate("COMMEN.ALLREADY_EXISTS", lang),
          description: i18n.translate("COMMEN.ALLREADY_EXISTS", lang),
        },
      };
    } 

    console.error("--- UNHANDLED ERROR ---", error);
    return {
      code: Enum.HTTP_CODES.INTERNAL_SERVER_ERROR || 500,
      error: {
        message: i18n.translate("COMMEN.UNKNOWN_ERROR", lang),
        description: i18n.translate("COMMEN.UNKNOWN_ERROR", lang),
      },
    };
  }
}

module.exports = Response;