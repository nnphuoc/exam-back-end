'use strict';

import Mongoose from './init-mongoose';
import UserModelClass from './classes/user';
import PluginUser from './plugins/plugin-user';

const ROLE = {
    ADMIN: 'admin',
    TEACHER: 'teacher',
    NORMAL: 'normal'
};

const schema = new Mongoose.Schema(
    {
        username: {
            type: String,
            maxlength: 255,
            required: true,
            unique: true
        },
        teacher: {
            type: Mongoose.Types.ObjectId,
            ref: 'Teacher'
        },
        password: {
            type: String,
            maxlength: 255
        },
        name: {
            type: String,
            maxlength: 254
        },
        email: {
            type: String,
            maxlength: 254
        },
        phone: {
            type: String,
            maxlength: 254
        },
        female: {
            type: Boolean,
            default: false
        },
        role: {
            type: String,
            enum: Object.values(ROLE),
            default: ROLE.NORMAL
        },
        address: {
            type: String,
            maxlength: 254
        },
        city: {
            type: String,
            maxlength: 254
        },
        dateOfBirth: {
            type: String,
            maxlength: 254
        },
        isVerify: {
            type: Boolean,
            default: false
        },
        avatar: {
            type: String,
            maxlength: 254
        },
        changePasswordAt: {
            type: Date
        },
        deletedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

schema.statics = {
    ROLE
};
schema.loadClass(UserModelClass);
schema.plugin(PluginUser);
const User = Mongoose.model('User', schema);

module.exports = User;
