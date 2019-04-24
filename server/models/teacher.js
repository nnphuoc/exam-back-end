'use strict';

import Mongoose from './init-mongoose';
import TeacherModelClass from './classes/teacher';
// import TeacherPlugin from './plugins/teacher-plugin';

const schema = new Mongoose.Schema(
    {
        user: {
            type: Mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        subject: {
            type: Mongoose.Types.ObjectId,
            ref: 'Subject',
            required: true,
            unique: true
        },
        avatar: {
            type: String
        },
        coverImage: {
            type: String
        },
        about: {
            type: String,
            maxlength: 500
        },
        slug: {
            type: String,
            unique: true,
            required: true
        },
        hotLine: {
            type: String,
            maxlength: 254
        },
        email: {
            type: String,
            maxlength: 254
        },
        fbLink: {
            type: String,
            maxlength: 254
        },
        countFollow: {
            type: Number,
            default: 0
        },
        countQuestion: {
            type: Number,
            default: 0
        },
        countView: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

schema.loadClass(TeacherModelClass);
// schema.plugin(TeacherPlugin);
const Teacher = Mongoose.model('Teacher', schema);

module.exports = Teacher;
