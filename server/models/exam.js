'use strict';

import Mongoose from './init-mongoose';
import ExamModelClass from './classes/exam';
// import ExamPlugin from './plugins/exam-plugin';

const STATUS = {
    RUNNING: 'runnin',
    PENDING: 'pending',
    CLOSE: 'close'
};

const schema = new Mongoose.Schema(
    {
        name: {
            type: String,
            maxlength: 254
        },
        teacher: {
            type: Mongoose.Types.ObjectId,
            ref: 'Teacher',
            unique: true,
            required: true
        },
        subject: {
            type: Mongoose.Types.ObjectId,
            ref: 'Subject'
        },
        numberStudent: {
            type: Number,
            maxlength: 500,
            default: 40
        },
        timeStart: {
            type: Date,
            required: true
        },
        timeEnd: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: Object.values(STATUS),
            default: STATUS.RUNNING
        }
    },
    {
        timestamps: true
    }
);

schema.statics = {
    STATUS
};

schema.loadClass(ExamModelClass);
// schema.plugin(ExamPlugin);
const Exam = Mongoose.model('Exam', schema);

module.exports = Exam;
