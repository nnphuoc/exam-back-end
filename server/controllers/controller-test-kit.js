'use strict';

import { TestKit, Teacher, Question, Subject } from '../models';
import { Response } from "../helpers";
import { pick } from 'lodash';

export default class ControllerTestKit {

    static async getAll (req, res, next) {
        try {
            const { limit, page } = req.query;
            const result = await TestKit.getAll({
                limit,
                page
            });
            if (!result) {
                return next(new Error('USER_NOT_FOUND_IN_EXAM'));
            }
            return Response.success(res, result);
        } catch (e) {
            return next(e);
        }
    }

    static async getAllByTeacher (req, res, next) {
        try {
            const { limit, page } = req.query;
            const slug = req.params.slug;
            const teacher = await Teacher.getOne({ where: { slug }, select: '_id'});
            if (!teacher._id) {
                return next(new Error('TEACHER_NOT_FOUND'));
            }
            const result = await TestKit.getAll({
                where: {
                    teacher: teacher._id
                },
                limit,
                page
            });
            if (!result) {
                return next(new Error('USER_NOT_FOUND_IN_EXAM'));
            }
            return Response.success(res, result);
        } catch (e) {
            return next(e);
        }
    }

    static async getAllBySubject (req, res, next) {
        try {
            const { limit, page } = req.query;
            const slug = req.params.slug;
            let where = {};
            if (slug) {
                where.slug = slug;
            }
            const subject = await Subject.getOne({ where, select: '_id'});
            console.log(subject);
            delete where.slug;
            if (slug && !subject._id) {
                return next(new Error('SUBJECT_NOT_FOUND'));
            }
            if (subject) {
                where.subject = subject._id;
            }
            const results = await TestKit.getAll({ where, limit, page });
            return Response.success(res, results);
        } catch (e) {
            return next(e);
        }
    }

    static async create (req, res, next) {
        try {
            const teacher = req.user.teacher;
            let data = pick(req.body, ['name', 'question', 'subject']);
            data.question = data.question.split(',');
            data.teacher = teacher;
            const promise = await Promise.all([
                TestKit.create(data),
                Teacher.updateOne({ _id: teacher }, { $inc: { countTestKit: 1 }})
            ]);
            const result = promise[0];
            return Response.success(res, result);
        } catch (e) {
            return next(e);
        }
    }

    static async update (req, res, next) {
        try {
            let data = pick(req.body, ['name', 'exam', 'question', 'subject']);
            const _id = req.params.id;
            const teacher = req.user.teacher;
            const result = await TestKit.updateOne({ _id, teacher }, { $set: data });
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