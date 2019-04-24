'use strict';

import Mongoose from './init-mongoose';
import SubjectModelClass from './classes/subject';
// import SubjectPlugin from './plugins/subject-plugin';

const schema = new Mongoose.Schema(
    {
        name: {
            type: String,
            maxlength: 254,
            required: true
        },
        countExam: {
            type: Number,
            default: 0
        },
        countQuestion: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

schema.loadClass(SubjectModelClass);
// schema.plugin(SubjectPlugin);
const Subject = Mongoose.model('Subject', schema);

module.exports = Subject;
