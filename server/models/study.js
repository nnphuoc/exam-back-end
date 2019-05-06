'use strict';

import Mongoose from './init-mongoose';
import StudyModelClass from './classes/study';
// import StudyPlugin from './plugins/study-plugin';

const schema = new Mongoose.Schema(
    {
        user: {
            type: Mongoose.Types.ObjectId,
            ref: 'User',
            required: true
        },
        teacher: {
            type: Mongoose.Types.ObjectId,
            ref: 'Teacher'
        },
        candidate: {
            type: Mongoose.Types.ObjectId,
            ref: 'Candidate'
        },
        subject: {
            type: Mongoose.Types.ObjectId,
            ref: 'Subject'
        },
        exam: {
            type: Mongoose.Types.ObjectId,
            ref: 'exam'
        },
        point: {
            type: String,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

schema.loadClass(StudyModelClass);
// schema.plugin(StudyPlugin);
const Study = Mongoose.model('Study', schema);

module.exports = Study;
