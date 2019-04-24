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
            ref: 'Exam',
            unique: true,
            required: true
        },
        questions: [
            {
                question: {
                    type: Mongoose.Types.ObjectId,
                    ref: 'Question'
                },
                answer: {
                    type: Array
                },
                image: {
                    type: String
                }
            }
        ],
        totalTime: {
            type: String
        },
        answer: {
            type: Array
        },
        totalPoint: {
            type: String,
            default: '10'
        },
        isHelp: {
            type: Boolean,
            default: true
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
