'use strict';
import Logger from './logger';

export default class Response {

    static success(res, data) {
        const responseData = !!data
            ? { success: true, result: data }
            : { success: true };
        return res.status(200).json(responseData);
    }

    static error (res, e) {
        if (process.env.NODE_ENV !== 'test') {
            console.error(e);
        }
        if (res) {
            let errors = [];
            if (e.type === 'serviceError') {
                errors = e.errors;
            } else {
                if (Array.isArray(e) && e.length > 0) {
                    errors = e.map(error => {
                        let param = null;
                        const arrError = error.message.split('*');
                        if (arrError.length === 2) {
                            error.message = arrError[1];
                            param = arrError[0];
                        }
                        let message = null;
                        if (res.__(error.message, param) !== error.message) {
                            message = res.__(error.message, param);
                        } else {
                            Logger.error({
                                api: res.req.originalUrl,
                                stack: error.stack
                            });
                            message = res.__('TECHNICAL_EXCEPTION');
                        }
                        return {
                            code: error.message,
                            message
                        };
                    });
                } else if (e.errors) {
                    console.error('---------------API-------------');
                    console.error(res.req.originalUrl);
                    console.error(e);
                    for (const errorKey in e.errors) {
                        let param = null;
                        const arrError = e.errors[errorKey].message.split('*');
                        if (arrError.length === 2) {
                            e.errors[errorKey].message = arrError[1];
                            param = arrError[0];
                        }
                        const errorMessage = res.__(e.errors[errorKey].message, param) !== e.errors[errorKey].message ? res.__(e.errors[errorKey].message, param) : res.__('TECHNICAL_EXCEPTION');
                        errors.push({
                            code: e.errors[errorKey].message,
                            message: errorMessage
                        });
                    }
                } else {
                    let param = null;
                    const arrError = e.message.split('*');
                    if (arrError.length === 2) {
                        e.message = arrError[1];
                        param = arrError[0];
                    }
                    let message = null;
                    if (res.__(e.message, param) !== e.message) {
                        message = res.__(e.message, param);
                    } else {
                        Logger.error({
                            api: res.req.originalUrl,
                            stack: e.stack
                        });
                        message = res.__('TECHNICAL_EXCEPTION');
                    }
                    errors = [
                        {
                            code: e.message,
                            message
                        }
                    ]
                }
            }
            return res.status(200).json({
                success: false,
                errors
            });
        }
        return {
            success: false,
            errors: e.message || e
        }
    }
};
