'use strict';

import { omit, pick } from 'lodash';
import { User } from '../models';
import { JWT, Response, StringHelper } from '../helpers';

export default class ControllerUser {

    static async getAllByAdmin (req, res, next) {
        try {
            const { limit, page } = req.params;
            const results = await User.getAll(limit, page);
            return Response.success(res, results);
        } catch (e) {
            return next(e);
        }
    }

    static async getOne (req, res, next) {
        try {
            const _id = req.params.id;
            const results = await User.getOne({ where: { _id }, select: '-password'});
            return Response.success(res, results);
        } catch (e) {
            return next(e);
        }
    }

    static async login (req, res, next) {
        try {
            const { username, password } = req.body;

            const user = await User.getOne({
                where: { username },
                select: '_id role avatar changePasswordAt password'
            });
            if (!user) {
                return next(new Error('USER_NOT_FOUND'));
            }
            const checkPassword = await User.comparePassword(password, user.password);
            if (!checkPassword) {
                return next(new Error('USER_INCORRECT'));
            }
            const result = Object.assign({}, user);
            delete result.password;
            const token = await JWT.sign({
                user: result
            });
            return Response.success(res, {
                access_token: token,
                role: result.role
            });
        } catch (e) {
            return next(e);
        }
    }

    static async create (req, res, next) {
        try {
            const { username, password, confirmPassword } = req.body;
            if (password !== confirmPassword) {
                return next(new Error('PASSWORD_NOT_MATCH'))
            }
            const count = await User.countDocuments({ username });
            if (count > 0) {
                return next(new Error('USERNAME_USED'));
            }
            const user = await User.create({
                username,
                password
            });
            delete user._doc.password
            return Response.success(res, user);
        } catch (e) {
            return next(e);
        }
    }

    static async update (req, res, next) {
        try {
            const _id = req.user._id;
            const data = pick(req.body, ['avatar', 'name', 'phone', 'address', 'school', 'dateOfBirth', 'female', 'city'])
            const result = await User.update({_id}, { $set: data });
            if (result.nModified === 0) {
                return next(new Error('ACTION_FAILED'));
            }
            return Response.success(res);
        } catch (e) {
            return next(e);
        }
    }

    static async changePassword (req, res, next) {
        try {
            const { oldPassword, newPassword } = req.body;
            if (!oldPassword || !newPassword) {
                return next(new Error('MISSING_PARAMS'));
            }
            const user = await User.getOne({
                where: {
                    _id: req.user._id
                },
                select: 'password',
                isLean: false
            });
            if (!user) {
                return next(new Error('USER_NOT_FOUND'));
            }
            const checkPassword = await User.comparePassword(oldPassword, user.password);
            if (!checkPassword) {
                return next(new Error('PASSWORD_INCORRECT'));
            }
            user.password = newPassword;
            await user.save();
            return Response.success(res);
        } catch (e) {
            return next(e);
        }
    }

    static async delete (req, res, next) {
        try {
            const _id = req.user._id;
            const deleted = await User.softDelete({ where: { _id }});
            if (deleted.nModified === 0) {
                return next(new Error('ACTION_FAILED'));
            }
            return Response.success(res);
        } catch (e) {
            return next(e);
        }
    }

    static getAvatarRandom  () {
        const indexAvatar = Math.floor(Math.random() * 58) + 1; // random: 1 -> 58
        return `avatar${indexAvatar}.png`;
    }
}