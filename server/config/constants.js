'use strict';

module.exports = {
    development: {
        RATE_LIMIT_TIME: 60, // second
        RATE_LIMIT_FILE: 10,
        CUSTOM_SERVICE_BUDGET_AD: 0.7,
        AMOUNT_MANAGEMENT_FANPAGE: {
            30: 2000000,
            60: 4000000,
            90: 6000000,
            120: 8000000
        },
        FEE_FACEBOOK_ADS: {
            6000000: 2000000,
            9000000: 3000000,
            12000000: 4000000,
            15000000: 5000000
        },
        AMOUNT_RECEIVE_POTENTIAL_CUSTOMER: 1000000,
        VERIFY_CODE_EXPIRED_TIME: 30, // minutes
        VERIFY_CODE_LIMITED_TIME: 1  // minutes
    },
    staging: {},
    production: {},
    paginate: {
        limit: 100,
        page: 1
    }
};