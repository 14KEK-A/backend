import HttpError from "./Http";

export default class WrongAuthenticationToken extends HttpError {
    constructor() {
        super(401, "Wrong authentication token");
    }
}
