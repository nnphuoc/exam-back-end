'use strict';

import Mongoose from './init-mongoose';
import TestKitModelClass from './classes/test-kit';
// import SubjectPlugin from './plugins/subject-plugin';

const schema = new Mongoose.Schema(
    {
        name: {
            type: String,
            maxlength: 1000
        },
        question: {
            type: Mongoose.Types.ObjectId,
            ref: 'Question'
        },
        exam: {
            type: Mongoose.Types.ObjectId,
            ref: 'Exam',
            unique: true,
        },
        subject: {
            type: Mongoose.Types.ObjectId,
            ref: 'Subject'
        },
        teacher: {
            type: Mongoose.Types.ObjectId,
            ref: 'Teacher'
        },
        number: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

schema.loadClass(TestKitModelClass);
// schema.plugin(SubjectPlugin);
const TestKit = Mongoose.model('TestKit', schema);

module.exports = TestKit;
