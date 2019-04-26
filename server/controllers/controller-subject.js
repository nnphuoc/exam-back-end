'use strict';

import { Subject } from '../models';
import { Response } from "../helpers";

export default class ControllerSubject {
    static async getAll (req, res, next) {
        try {
            const { limit, page } = req.query;
            const results = await Subject.getAll({ limit, page });
            return Response.success(res, results);
        } catch (e) {
            return next(e);
        }
    }

    static async create (req, res, next) {
        try {
            const name = req.body.name;
            if (!name) {
                return next(new Error('MISSING_PARAMS'));
            }
            const slug = name.normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd').replace(/Đ/g, 'D')
                .replace(' ', '-');
            const count = await Subject.countDocuments({ where: { name, slug }});
            if (count > 0) {
                return next(new Error('SUBJECT_EXIST'));
            }
            await Subject.create({ name });
            return Response.success(res);
        } catch (e) {
            return next(e);
        }
    }

    static async update (req, res, next) {
        try {
            const _id= req.params._id;
            const name = req.body.name;
            const result = await Subject.updateOne({ _id },{ $set: { name }});
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
            const _id= req.params._id;
            const result = await Subject.softDelete({ where: { _id }});
            if (result.nModified === 0) {
                return next(new Error('ACTION_FAILED'));
            }
            return Response.success(res);
        } catch (e) {
            return next(e);
        }
    }
}