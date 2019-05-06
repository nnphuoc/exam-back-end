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
            type: Array,
        },
        subject: {
            type: Mongoose.Types.ObjectId,
            ref: 'Subject'
        },
        teacher: {
            type: Mongoose.Types.ObjectId,
            ref: 'Teacher'
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
