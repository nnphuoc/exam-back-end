'use strict';

import Mongoose from './init-mongoose';
import CandidateModelClass from './classes/candidate';
// import CandidatePlugin from './plugins/candidate-plugin';

const schema = new Mongoose.Schema(
    {
        user: {
            type: Mongoose.Types.ObjectId,
            ref: 'User',
            unique: true,
            required: true
        },
        exam: {
            type: Mongoose.Types.ObjectId,
            ref: 'Exam'
        },
        teacher: {
            type: Mongoose.Types.ObjectId,
            ref: 'Teacher',
            required: true
        },
        answer: {
            type: String,
        },
        totalTime: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

schema.loadClass(CandidateModelClass);
// schema.plugin(CandidatePlugin);
const Candidate = Mongoose.model('Candidate', schema);

module.exports = Candidate;
