'use strict';

import { JWT } from '../helpers';
import { User } from '../models';

export default class AuthMiddleware {
    static isAuth = async (req, res, next) => {
        try {
            const token = JWT.getToken(req);
            if (!token) {
                return next(new Error('AUTHENTICATION_FAILED'));
            }
            return await AuthMiddleware.verifyToken(token, req, res, next);
        } catch (error) {
            return next(error);
        }
    };

    static isOptionalAuth = async (req, res, next) => {
        try {
            const token = JWT.getToken(req);
            if (!token) {
                return next();
            }
            return await AuthMiddleware.verifyToken(token, req, res, next);
        } catch (e) {
            return next(e);
        }
    };

    static verifyToken = async (token, req, res, next) => {
        try {
            const verifyUser = await AuthMiddleware.verifyUserFromToken(token);
            req.user = verifyUser.user;
            const user = await User.getOne({
                where: {
                    _id: req.user._id
                },
                select: '_id changePasswordAt role username email teacher'
            });
            if (!user) {
                return next(new Error('AUTHENTICATION_FAILED'));
            }
            if (
                user.changePasswordAt &&
                new Date(user.changePasswordAt).toString() !==
                    new Date(req.user.changePasswordAt).toString()
            ) {
                return next(new Error('AUTHENTICATION_FAILED'));
            }
            if (user.isVerify === false) {
                return next(new Error('VERIFICATION_FAILED'));
            }
            req.user.role = user.role;
            req.user.username = user.username;
            req.user.teacher = user.teacher;

            if (next) {
                return next();
            }
        } catch (e) {
            return next(e);
        }
    };

    static verifyUserFromToken = async (token, option) => {
        const verifiedData = await JWT.verify(token, option);
        return {
            ...verifiedData
        };
    };
}
