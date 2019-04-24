'use strict';

import BaseModelClass from './Base'
import BCrypt from 'bcrypt';

export default class UserModelClass extends BaseModelClass {
    static async getUsername(params) {
        const where = {};
        if (params._id) {
            where._id = params._id;
        }
        if (params.username) {
            where.username = params.username;
        }
        const results = await this.findOne(where);
        if (results.length === 0) {
            return Promise.reject(new Error('NOT_FOUND_USER_ID'));
        }
        if (results.length > 1) {
            return Promise.reject(new Error('SOMETHING_WRONG'));
        }
        return results.username;
    }

    static async comparePassword(password, passwordHash) {
        return await BCrypt.compare(password, passwordHash);
    }
}
