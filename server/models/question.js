'use strict';

import Mongoose from './init-mongoose';
import QuestionModelClass from './classes/question';
// import QuestionPlugin from './plugins/question-plugin';

const schema = new Mongoose.Schema(
    {
        subject: {
            type: Mongoose.Types.ObjectId,
            ref: 'Subject',
            required: true,
            unique: true
        },
        teacher: {
            type: Mongoose.Types.ObjectId,
            ref: 'Teacher',
            required: true,
            unique: true
        },
        question: {
            type: String
        },
        anwer: {
            type: Array,
            maxlength: 10
        },
        correct: {
            type: String
        },
        image: {
            type: String,
            maxlength: 254
        },
        help: {
            type: String,
        },
        countFollow: {
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

schema.loadClass(QuestionModelClass);
// schema.plugin(QuestionPlugin);
const Question = Mongoose.model('Question', schema);

module.exports = Question;
