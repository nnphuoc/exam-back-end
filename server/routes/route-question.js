'use strict';

import { ControllerQuestion } from '../controllers'
import { User } from '../models'
import { ValidationBase } from '../validations';
import { AuthMiddleware, RoleMiddleware } from '../middlwares';

const isTeacher = RoleMiddleware.isValidRole(User.ROLE.TEACHER);
const isAuth = AuthMiddleware.isAuth;
const isOptionalAuth = AuthMiddleware.isOptionalAuth;

module.exports = (app, router) => {

    router
        .route('/questions')
        .get([ValidationBase.validatePagination], ControllerQuestion.getAll)
        .post([isAuth, isTeacher], ControllerQuestion.createOne);

    router
        .route('/questions/subject/:slug')
        .get([ValidationBase.validatePagination], ControllerQuestion.getAllBySubject);

    router
        .route('/questions/teacher/:slug')
        .get([ValidationBase.validatePagination], ControllerQuestion.getAllByTeacher);

    router
        .route('/question/:id')
        .put([isAuth, isTeacher, ValidationBase.validateObjectId], ControllerQuestion.update)
        .delete([isAuth, isTeacher, ValidationBase.validateObjectId], ControllerQuestion.delete);
};