'use strict';

import { ControllerStudy } from '../controllers'
import { User } from '../models'
import { ValidationBase } from '../validations';
import { AuthMiddleware, RoleMiddleware } from '../middlwares';

const isTeacher = RoleMiddleware.isValidRole(User.ROLE.TEACHER);
const isAuth = AuthMiddleware.isAuth;
const isOptionalAuth = AuthMiddleware.isOptionalAuth;

module.exports = (app, router) => {

    router
        .route('/study/:subject')
        .get([isAuth, ValidationBase.validatePagination], ControllerStudy.getAllBySubject);

    router
        .route('/study/teacher/:exam')
        .get([isAuth, isTeacher, ValidationBase.validatePagination], ControllerStudy.getAllByTeacher);
};