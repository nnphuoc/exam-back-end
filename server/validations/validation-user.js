'use strict';

import ValidationBase from './validation-base';
import validator from "./validator";

export default class ValidationUser extends ValidationBase {

    static validateUsername (req, res, next) {
        const rule = {
            username: 'required|username'
        };
        const validate = validator.validator(rule, req.body);
        if (validate) {
            return next(validate);
        }
        return next();
    }

    static async validateVerifyUser (req, res, next) {
        const rule = {
            username: 'required|username',
            code: 'required'
        };
        const validate = validator.validator(rule, req.body);
        if (validate) {
            return next(validate);
        }
        return next();
    }

    static async validateSetPassword (req, res, next) {
        const { password, confirmPassword } = req.body;
        if (!password || !confirmPassword) {
            return next([new Error('INVALID_PARAMS')]);
        }
        if (password !== confirmPassword) {
            return next([new Error('PASSWORD_NOT_MATCH')]);
        }
        return next();
    }
}