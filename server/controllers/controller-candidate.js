'use strict';

import { Candidate } from '../models';
import { Response } from "../helpers";
import { pick } from 'lodash';

export default class ControllerCandidate {

    static async getAllByExam (req, res, next) {
        try {
            const { limit, page } = req.params;
            const exam = req.params.exam;
            const result = await Candidate.getOne({
                where: { exam },
                limit,
                page
            });
            return Response.success(res, result);
        } catch (e) {
            return next(e);
        }
    }

    static async getAllByTestKit (req, res, next) {
        try {
            const { limit, page } = req.params;
            const testKit = req.params.testKit;
            const result = await Candidate.getOne({
                where: { testKit },
                limit,
                page
            });
            return Response.success(res, result);
        } catch (e) {
            return next(e);
        }
    }

    static async enterTheExam (req, res, next) {
        try {
            const user = req.user._id;
            let data = pick(req.body, ['exam', 'testKit', 'isHelp']);
            data.user = user;
            const result = await Candidate.create(data);
            return Response.success(res, result);
        } catch (e) {
            return next(e);
        }
    }

    static async testScope (req, res, next) {  // chấm điểm
        try {
            const _id = res.params.id;
            const user = res.user._id;
            const data = pick(req.body, []);
            const result = await Candidate.getOne({ where: { user, _id }});
            if (!result) {
                return next(new Error('USER_NOT_FOUND_IN_EXAM'));
            }
            return Response.success(res, result);
        } catch (e) {
            return next(e);
        }
    }
}