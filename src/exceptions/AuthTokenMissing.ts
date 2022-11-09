import HttpError from "./Http";

export default class AuthenticationTokenMissingException extends HttpError {
    constructor() {
        super(401, "Authentication token missing");
    }
}
