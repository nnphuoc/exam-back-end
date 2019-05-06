'use strict';

import { Candidate, Question, Exam, TestKit, Study } from '../models';
import { Response } from "../helpers";
import { pick } from 'lodash';

export default class ControllerCandidate {

    static async enterTheExam (req, res, next) {
        try {
            const user = req.user._id;
            let data = pick(req.body, ['exam', 'testKit', 'teacher']);
            data.user = user;
            const result = await Candidate.create(data);
            return Response.success(res, result);
        } catch (e) {
            return next(e);
        }
    }

    static async startTheExam (req, res, next) {
        try {
            const _id = req.params.id;
            const candidate = await Candidate.getOne({ where: { _id }, select: 'exam' });
            if (!candidate) {
                return next(new Error('YOU_NOT_FOUND_IN_EXAM'));
            }
            const dataExam = await Exam.getOne({ where: { _id: candidate.exam }, select: 'testKit number isHelp status' });
            if (!dataExam.testKit) {
                return next(new Error('EXAM_NOT_FOUND_TEST_KIT'));
            }
            if (dataExam.status !== 'running') {
                return next(new Error('THE_EXAM_NOT_RUNNING'));
            }
            let select = 'question answer image';
            if (dataExam.isHelp){
                select += ' help';
            }
            const listQuestion = await TestKit.getOne({ where: { _id: dataExam.testKit }, select: 'question' });
            if (listQuestion.question.length === 0 ) {
                return next(new Error('QUESTION_NOT_FOUND'));
            }
            const results = await Question.getAll({
                where: {
                    _id: { $in:  listQuestion.question }
                },
                select
            });
            return Response.success(res, results);
        } catch (e) {
            return next(e);
        }
    }

    static async testScope (req, res, next) {  // chấm điểm
        try {
            const _id = req.params.id;
            const user = req.user._id;
            const { data, totalTime } = req.body;
            const candidate = await Candidate.getOne({ where: { _id, user }});
            candidate.totalTime = totalTime;
            if (!candidate) {
                return next(new Error('USER_NOT_FOUND_IN_EXAM'));
            }
            const listQuestionAndAnswer = data;
            let totalCorrect = 0;
            for (let i = 0, len = listQuestionAndAnswer.length; i < len; i++) {
                totalCorrect += await Question.countDocuments({ _id: listQuestionAndAnswer[i].question, correct: listQuestionAndAnswer[i].correct });
            }
            const exam = await Exam.getOne({ where: { _id: candidate.exam }, select: 'totalPoint subject teacher'});
            const point = totalCorrect * (parseInt(exam.totalPoint) / listQuestionAndAnswer.length);
            const study = await Study.create({
                user,
                candidate: _id,
                subject: exam.subject,
                teacher: exam.teacher,
                point
            });
            // candidate.save();
            return Response.success(res, study);
        } catch (e) {
            return next(e);
        }
    }
}
