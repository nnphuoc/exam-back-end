'use strict';

import validator from './validator';

export default class BaseValidation {
    static async validatePagination(req, res, next) {
        if (req.query.limit !== undefined) {
            req.query.limit = parseInt(req.query.limit);
            if (isNaN(req.query.limit)) {
                return next(new Error('TECHNICAL_EXCEPTION'));
            }
            if (req.query.limit < 1) {
                return next(new Error('LIMIT_INVALID_VALUE'));
            }
        }
        if (req.query.page !== undefined) {
            req.query.page = parseInt(req.query.page);
            if (isNaN(req.query.page)) {
                return next(new Error('TECHNICAL_EXCEPTION'));
            }
            if (req.query.page < 1) {
                return next(new Error('PAGE_INVALID_VALUE'));
            }
        }
        return next();
    }

    static validateObjectId(req, res, next) {
        const rule = {
            id: 'object_id'
        };
        const validate = validator.validator(rule, req.params);
        if (validate) {
            return next(validate);
        }
        return next();
    }
}
