'use strict';

import { Candidate, Question, Exam, TestKit, Study } from '../models';
import { Response } from "../helpers";
import { pick } from 'lodash';

export default class ControllerCandidate {

    static async enterTheExam (req, res, next) {
        try {
            const user = req.user._id;
            let data = pick(req.body, ['exam', 'testKit']);
            data.user = user;
            const result = await Candidate.create(data);
            return Response.success(res, result);
        } catch (e) {
            return next(e);
        }
    }

    static async startTheExam (req, res, next) {
        try {
            const user = req.user._id;
            const _id = req.params._id;
            const candidate = await Candidate.getOne({ where: { _id, user }, select: 'exam' });
            if (!candidate) {
                return next(new Error('YOU_NOT_FOUND_IN_EXAM'));
            }
            const dataExam = await Exam.getOne({ where: { exam: candidate.exam }, select: 'testKit number isHelp' });
            if (!dataExam.testKit) {
                return next(new Error('EXAM_NOT_FOUND_TEST_KIT'));
            }
            let object = {
                question: 1,
                answer: 1,
                image:1,
                help: 0,
                correct: 0
            };
            if (dataExam.isHelp){
                object.help = 1;
            }
            const listQuestion = await TestKit.getOne({ where: { testKit: dataExam.testKit }, select: 'question' });
            if (listQuestion.question.length === 0 ) {
                return next(new Error('QUESTION_NOT_FOUND'));
            }
            const results = await Question.aggregate([
                {
                    $match: { _id: { $in: listQuestion.question }}
                },
                {
                    $sample: { size: dataExam.number }
                },
                {
                    $project: {
                        object
                    }
                }
            ]);
            return Response.success(res, results);
        } catch (e) {
            return next(e);
        }
    }

    static async testScope (req, res, next) {  // chấm điểm
        try {
            const _id = res.params.id;
            const user = res.user._id;
            const { data, totalTime } = req.body;
            const candidate = await Candidate.getOne({ where: { _id, user }});
            candidate.totalTime = totalTime;
            if (!candidate) {
                return next(new Error('USER_NOT_FOUND_IN_EXAM'));
            }
            if (!JSON.parse(data)) {
                return next(new Error('PARSE_JSON_FAIL'));
            }
            const listQuestionAndAnswer = JSON.parse(data);
            const promise = await Promise.all([
                listQuestionAndAnswer.reduce( async (scope, answer) => {
                    return scope + await Question.countDocuments({ _id: answer.question, correct: answer.correct });
                }, 0),
                Exam.getOne({ where: { _id: candidate.exam }, select: 'totalPoint, subject, teacher'})
            ]);
            const { totalCorrect, exam } = promise;
            const point = totalCorrect * (exam.totalPoint / listQuestionAndAnswer.length);
            const study = await Study.create({
                user,
                candidate: _id,
                subject: exam.subject,
                teacher: exam.teacher,
                point
            });
            candidate.save();
            return Response.success(res, study);
        } catch (e) {
            return next(e);
        }
    }
}
