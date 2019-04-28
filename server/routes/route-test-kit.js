'use strict';

import { ControllerTestKit } from '../controllers'
import { User } from '../models'
import { ValidationBase } from '../validations';
import { AuthMiddleware, RoleMiddleware } from '../middlwares';

const isTeacher = RoleMiddleware.isValidRole(User.ROLE.TEACHER);
const isAuth = AuthMiddleware.isAuth;
const isOptionalAuth = AuthMiddleware.isOptionalAuth;

module.exports = (app, router) => {

    router
        .route('/test-kit')
        .get([ValidationBase.validatePagination], ControllerTestKit.getAll)
        .post([isAuth, isTeacher], ControllerTestKit.create);

    router
        .route('/test-kit/subject/:slug')
        .get([ValidationBase.validatePagination], ControllerTestKit.getAllBySubject);

    router
        .route('/test-kit/teacher/:slug')
        .get([ValidationBase.validatePagination], ControllerTestKit.getAllByTeacher);

    router
        .route('/test-kit/:id')
        .put([isAuth, isTeacher, ValidationBase.validateObjectId], ControllerTestKit.update)
        .delete([isAuth, isTeacher, ValidationBase.validateObjectId], ControllerTestKit.delete);
};