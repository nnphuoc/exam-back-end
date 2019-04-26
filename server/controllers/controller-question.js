'use strict';

import { Question, Subject, Teacher } from '../models';
import { Response } from "../helpers";
import { pick } from 'lodash';

export default class ControllerQuestion {

    static async getAll (req, res, next) {
        try {
            const { limit, page } = req.query;
            const results = await Question.getAll({ limit, page });
            return Response.success(res, results);
        } catch (e) {
            return next(e);
        }
    }

    static async getAllBySubject (req, res, next) {
        try {
            const { limit, page } = req.query;
            const slug = req.body.slug;
            const subject = await Subject.getOne({ where: { slug }, select: '_id'});
            if (!subject) {
                return next(new Error('SUBJECT_NOT_FOUND'));
            }
            const results = await Question.getAll({ where: { subject: subject._id }, limit, page });
            return Response.success(res, results);
        } catch (e) {
            return next(e);
        }
    }

    static async getAllByTeacher (req, res, next) {
        try {
            const { limit, page } = req.query;
            const slug = req.body.slug;
            const teacher = await Teacher.getOne({ where: { slug }, select: '_id'});
            if (!teacher) {
                return next(new Error('TEACHER_NOT_FOUND'));
            }
            const results = await Question.getAll({ where: { teacher: teacher._id },limit, page });
            return Response.success(res, results);
        } catch (e) {
            return next(e);
        }
    }

    static async createOne (req, res, next) {
        try {
            let data = pick(req.body, ['question', 'answer', 'correct', 'image', 'help', 'subject', 'teacher']);
            if (data.answer) {
                data.answer = data.answer.split(',');
            }
            const promise = await Promise.all([
               Subject.countDocuments({ where: { _id: data.subject }}),
               Teacher.countDocuments({ where: { _id: data.teacher }})
            ]);
            const [ countSubject, countTeacher ] = promise;
            if (countSubject === 0 || countTeacher === 0) {
                return next(new Error('SUBJECT_OR_TEACHER_NOT_FOUND'));
            }
            const results = await Promise.all([
                Question.create(data),
                Subject.updateOne({ _id : data.subject }, { $inc: { countQuestion: 1 }}),
                Teacher.updateOne({ _id : data.teacher }, { $inc: { countQuestion: 1 }})
            ]);
            const question = results[0];
            return Response.success(res, question);
        } catch (e) {
            return next(e);
        }
    }

    static async update (req, res, next) {
        try {
            let data = pick(req.body, ['question', 'answer', 'correct', 'image', 'help', 'subject']);
            if (data.answer) {
                data.answer = data.answer.split(',');
            }
            const _id = req.params.id;
            const teacher = req.user.teacher;
            const result = await Question.updateOne({ _id, teacher }, { $set: { data }});
            if (result.nModified === 0) {
                return next(new Error('ACTION_FAILED'));
            }
            return Response.success(res);
        } catch (e) {
            return next(e);
        }
    }

    static async delete (req, res, next) {
        try {
            const _id = req.params.id;
            const teacher = req.user.teacher;
            const deleted = await Question.softDelete({ where: { _id, teacher }});
            if (deleted.nModified === 0) {
                return next(new Error('ACTION_FAILED'));
            }
            await Teacher.updateOne({ _id: teacher }, { $inc: { countTestKit: -1 }});
            return Response.success(res);
        } catch (e) {
            return next(e);
        }
    }
}