class ApiError  {
    constructor(statusCode = "", details = null, message = "False") {
        this.statusCode = statusCode;
        this.details = details;
        this.message = message;
    }
}

export default ApiError;
