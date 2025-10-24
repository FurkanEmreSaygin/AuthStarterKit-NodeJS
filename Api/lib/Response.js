const Enum = require('../config/Enum');
const CustomError = require('./Error');

class Response {
    constructor() {}

    static successResponse(data, code = 200) {
        return {
            code,
            data
        };
    }

    static errorResponse(error, code = 500) {
        if (error instanceof CustomError){
            return {
                code: error.code,
                error: {
                    message: error.message,
                    description: error.description || null,
                }
            };
        }
        return {
            code: Enum.HTTP_CODES.INTERNAL_SERVER_ERROR,
            error: {
                message: "Unknown_error",
                description: error.message,
            }
        }
    }
}

module.exports = Response;