'use strict';

import Mongoose from './init-mongoose';
import StudyModelClass from './classes/study';
// import StudyPlugin from './plugins/study-plugin';

const schema = new Mongoose.Schema(
    {
        user: {
            type: Mongoose.Types.ObjectId,
            ref: 'User',
            unique: true,
            required: true
        },
        teacher: {
            type: Mongoose.Types.ObjectId,
            ref: 'Teacher'
        },
        cadidate: {
            type: Mongoose.Types.ObjectId,
            ref: 'Candidate'
        },
        subject: {
            type: Mongoose.Types.ObjectId,
            ref: 'Subject'
        },
        exam: {
            type: Mongoose.Types.ObjectId,
            ref: 'exame'
        },
        point: {
            type: Number,
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
