'use strict';

import mongoose from 'mongoose';
import { constants } from '../config';

const ruleValidate = {
    required: function(data, input) {
        if (data === undefined || data === '') {
            return new Error(`${input}*MISSING_PARAMS`);
        }
    },

    boolean: function(data, input) {
        if (data !== undefined) {
            if (!(true === data || false === data)) {
                return new Error(`${input}*INVALID_BOOLEAN`);
            }
        }
    },

    object_id: function(data, input) {
        if (data !== undefined) {
            if (data.length !== 24 || !mongoose.Types.ObjectId.isValid(data)) {
                return new Error(`${input}*INVALID_OBJECT_ID`);
            }
        }
    },

    uuid: function(data, input) {
        if (data !== undefined) {
            const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
            const checkUUID = regex.test(String(data));
            if (!checkUUID) {
                return new Error(`${input}*INVALID_UUID`);
            }
        }
    },

    number: function(data, input) {
        if (data !== undefined) {
            if ('number' !== typeof data) {
                return new Error(`${input}*INVALID_NUMBER`);
            }
        }
        data = parseInt(data);
        if (isNaN(data)) {
            return new Error(`${input}*INVALID_NUMBER`);
        }
    },

    array: function(data, input) {
        if (data) {
            if (!Array.isArray(data)) {
                return new Error(`${input}*INVALID_ARRAY`);
            }
        }
    },
    isObject: function(data, input) {
        if (data) {
            if (!(typeof data === 'object' && data !== null)) {
                return new Error(`${input}*INVALID_OBJECT`);
            }
        }
    },
    max_length: function(data, field) {
        if (data && data.length > 255) {
            return new Error(`${field}*INVALID_MAX_LENGTH`);
        }
    },

    budget_ad: function(data, field) {
        if (!constants.FEE_FACEBOOK_ADS[data]) {
            return new Error(`${field}*INVALID_PARAM`);
        }
    },

    management_fanpage: function(data, field) {
        if (!constants.AMOUNT_MANAGEMENT_FANPAGE[data]) {
            return new Error(`${field}*INVALID_PARAM`);
        }
    },

    username: function(data, field) {
        if (data !== undefined) {
            const regex = /^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
            const check = regex.test(String(data));
            if (!check) {
                return new Error(`${field}*INVALID_USERNAME`);
            }
        }
    },
    email: function(data, field) {
        if (data) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const check = re.test(String(data).toLowerCase());
            if (!check) {
                return new Error(`${field}*INVALID_EMAIL`);
            }
        }
    },
    date: function(data, field) {
        if (data) {
            var re = /^(([0]?[1-9]|1[0-2])\/([0-2]?[0-9]|3[0-1])\/[1-2]\d{3}) (20|21|22|23|[0-1]?\d{1}):([0-5]?\d{1}):([0-5]?\d{1})$/;
            const check = re.test(String(data).toLowerCase());
            if (!check) {
                return new Error(`${field}*INVALID_DATE`);
            }
        }
    },

    phoneNumber: function(data, field) {
        if (data) {
            var re = /(0[0-9])+([0-9]{8})\b$/;
            const check = re.test(String(data).toLowerCase());
            if (!check) {
                return new Error(`${field}*INVALID_PHONE`);
            }
        }
    }
};

export default {
    validator: function(rule, data) {
        if (data && rule) {
            const errors = [];
            for (const fields in rule) {
                const arrField = rule[fields].split('|');
                if (arrField.length > 0) {
                    const fieldData = data[fields];
                    for (const field of arrField) {
                        const isValid = ruleValidate[field];
                        if (!isValid) {
                            console.log(
                                'Validator: ',
                                `Rule "${field}" not define.`
                            );
                            errors.push(new Error('TECHNICAL_EXCEPTION'));
                        }
                        const error = isValid(fieldData, fields.toUpperCase());
                        if (error) {
                            errors.push(error);
                        }
                    }
                }
            }
            if (errors.length > 0) {
                return errors;
            }
        }
    }
};
