'use strict';

import { pick } from "lodash";
import { Teacher, User } from "../models";
import { Response } from "../helpers";

export default class ControllerTeacher {
    static async getAll (req, res, next) {
        try {
            const { limit, page } = req.query;
            const results = await Teacher.getAll({ limit, page });
            return Response.success(res, results);
        } catch (e) {
            return next(e);
        }
    }

    static async getTeacherBySlug (req, res, next) {
        try {
            const slug = req.params.slug;
            const result = await Teacher.getOne({ where: { slug }});
            if (!result) {
                return next(new Error('TEACHER_NOT_FOUND'));
            }
            return Response.success(res, result);
        } catch (e) {
            return next(e);
        }
    }

    static async getOne (req, res, next) {
        try {
            const _id = req.params.id;
            const result = await Teacher.getOne({ where: { _id }});
            if (!result) {
                return next(new Error('TEACHER_NOT_FOUND'));
            }
            return Response.success(res, result);
        } catch (e) {
            return next(e);
        }
    }

    static async becomeTeacher (res, req, next) {
        try {
            const user = req.user._id;
            const count = await User.countDocuments({where: { _id: user, teacher: { $ne: null }, deletedAt: null }});
            if (count > 0) {
                return next(new Error('TEACHER_EXIST'));
            }
            const teacher = await Teacher.create({ user });
            await User.update({ _id: user }, { $set: { role: User.ROLE.TEACHER, teacher: teacher._id }});
            teacher.slug = teacher._id;
            await teacher.save();
            return Response.success(res, teacher);
        } catch (e) {
            return next(e);
        }
    }

    static async checkSlug (req, res, next) {
        try {
            if (!req.body.slug) {
                return next(new Error('MISSING_PARAMS'));
            }
            const slug = req.body.slug;
            const count = await Teacher.countDocuments({ where: { slug }});
            if (count > 0) {
                return next(new Error('SLUG_USED'));
            }
            return Response.success(res);
        } catch (e) {
            return next(e);
        }
    }

    static async updateSlug (req, res, next) {
        try {
            if (!req.body.slug) {
                return next(new Error('MISSING_PARAMS'));
            }
            const _id = req.user._id;
            const slug = req.body.slug;
            const result = await Teacher.update({ _id }, { $set: {slug}});
            if (result.nModified === 0) {
                return next(new Error('ACTION_FAILED'));
            }
            return Response.success(res);
        } catch (e) {
            return next(e);
        }
    }

    static async update (req, res, next) {
        try {
            const data = pick(req.body, ['subject', 'avatar', 'coverImage', 'about', 'hotline', 'fbLink']);
            const _id = req.user._id;
            const result = await Teacher.update({ _id }, { $set: { data }});
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
            const _id = req.user._id;
            const deleted = await Teacher.softDelete({ where: { _id }});
            if (deleted.nModified === 0) {
                return next(new Error('ACTION_FAILED'));
            }
            return Response.success(res);
        } catch (e) {
            return next(e);
        }
    }
}