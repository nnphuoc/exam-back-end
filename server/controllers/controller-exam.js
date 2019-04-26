'use strict';

import {Exam, Subject, Teacher} from '../models'
import { Response } from "../helpers";
import { pick } from 'lodash';

export default class ControllerExam {

    static async getAll (req, res, next) {
        try {
            const { limit, page } = req.query;
            const results = await Exam.getAll({
                where: {
                    status: 'running'
                },
                limit,
                page });
            return Response.success(res, results);
        } catch (e) {
            return next(e);
        }
    }

    static async getAllBySubject (req, res, next) {
        try {
            const { limit, page } = req.query;
            const slug = req.params.slug;
            const subject = await Subject.getOne({ where: { slug }, select: '_id'});
            if (!subject) {
                return next(new Error('SUBJECT_NOT_FOUND'));
            }
            const results = await Exam.getAll({
                where: {
                    subject: subject._id,
                    status: 'running'
                },
                limit,
                page });
            return Response.success(res, results);
        } catch (e) {
            return next(e);
        }
    }

    static async getAllByTeacher (req, res, next) {
        try {
            const { limit, page } = req.query;
            const slug = req.params.slug;
            const teacher = await Teacher.getOne({ where: { slug }, select: '_id'});
            if (!teacher) {
                return next(new Error('SUBJECT_NOT_FOUND'));
            }
            const results = await Exam.getAll({
                where: {
                    teacher: teacher._id,
                    status: 'running'
                },
                limit,
                page });
            return Response.success(res, results);
        } catch (e) {
            return next(e);
        }
    }

    static async getOne (req, res, next) {
        try {
            const _id = req.params.id;
            const result = await Exam.getOne({ where: { _id }});
            return Response.success(res, result);
        } catch (e) {
            return next(e);
        }
    }

    static async create (req, res, next) {
        try {
            const teacher = req.user.teacher;
            let data = pick(req.body, ['subject', 'numberStudent', 'timeStart', 'timeEnd', 'status']);
            data.teacher = teacher;
            const result = await Exam.create(data);
            return Response.success(res, result);
        } catch (e) {
            return next(e);
        }
    }

    static async update (req, res, next) {
        try {
            const _id = req.params.id;
            const teacher = req.user.teacher;
            let data = pick(req.body, ['subject', 'numberStudent', 'timeStart', 'timeEnd', 'status']);
            data.teacher = teacher;
            const result = await Exam.updateOne({ _id }, { $set: data });
            if (result.nModified === 0) {
                return next(new Error('ACTION_FAILED'));
            }
            return Response.success(res, result);
        } catch (e) {
            return next(e);
        }
    }

    static async delete (req, res, next) {
        try {
            const _id = req.params.id;
            const teacher = req.user.teacher;
            const deleted = await Exam.softDelete({ where: { _id, teacher }});
            if (deleted.nModified === 0) {
                return next(new Error('ACTION_FAILED'));
            }
            return Response.success(res);
        } catch (e) {
            return next(e);
        }
    }
}
