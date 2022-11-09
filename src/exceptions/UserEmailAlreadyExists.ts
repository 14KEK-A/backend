import HttpError from "./Http";

export default class UserWithThatEmailAlreadyExistsException extends HttpError {
    constructor(email: string) {
        super(400, `User with email ${email} already exists`);
    }
}
