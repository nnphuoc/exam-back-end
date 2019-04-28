'use strict';

import { Study } from '../models';
import { Response } from "../helpers";

export default class ControllerStudy {

    static async getAllBySubject (req, res, next) {
        try {
            const user = req.user._id;
            const subject = req.params.subject;
            const { limit, page } = req.query;
            const results = await Study.getAll({
                where: {
                    user,
                    subject
                },
                limit,
                page
            });
            return Response.success(res, results);
        } catch (e) {
            return next(e);
        }
    }

    static async getAllByTeacher (req, res, next) {
        try {
            const { _id, teacher } = req.user;
            const { limit, page } = req.query;
            const exam = req.params.exam;
            const results = await Study.getAll({
                where: {
                    user: _id,
                    teacher,
                    exam
                },
                limit,
                page
            });
            return Response.success(res, results);
        } catch (e) {
            return next(e);
        }
    }
}