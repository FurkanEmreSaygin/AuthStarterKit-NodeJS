const Enum = require('../config/Enum');
const CustomError = require('./Error');

class Response {
  constructor() {}

  static successResponse(data, code = 200) {
    return {
      code,
      data,
    };
  }

  static errorResponse(error) {
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
          message: "Duplicate Key Error",
          description:"Somethings is duplicating",
        },
      };
    } 

    console.error("--- UNHANDLED ERROR ---", error);

    return {
      code: Enum.HTTP_CODES.INTERNAL_SERVER_ERROR || 500,
      error: {
        message: "Internal Server Error",
        description: "Sunucuda beklenmedik bir hata oluştu.", 
      },
    };
  }
}

module.exports = Response;