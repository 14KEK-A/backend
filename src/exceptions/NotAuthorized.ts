import HttpError from "./Http";

export default class NotAuthorizedException extends HttpError {
    constructor() {
        super(403, "You're not authorized");
    }
}
