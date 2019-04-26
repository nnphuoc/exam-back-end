'use strict';

import { ControllerExam } from '../controllers';
import { User } from '../models'
import { ValidationBase } from '../validations';
import { AuthMiddleware, RoleMiddleware } from '../middlwares';

const isTeacher = RoleMiddleware.isValidRole(User.ROLE.TEACHER);
const isAuth = AuthMiddleware.isAuth;
const isOptionalAuth = AuthMiddleware.isOptionalAuth;

module.exports = (app, router) => {

    router
        .route('/exams')
        .get([ValidationBase.validatePagination], ControllerExam.getAll)
        .post([isAuth, isTeacher], ControllerExam.create);

    router
        .route('/exam/subject/:slug')
        .get([ValidationBase.validatePagination], ControllerExam.getAllBySubject);

    router
        .route('/exam/teacher/:slug')
        .get([ValidationBase.validatePagination], ControllerExam.getAllByTeacher);

    router
        .route('/exam/:id')
        .put([ValidationBase.validateObjectId], ControllerExam.update)
        .delete([ValidationBase.validateObjectId], ControllerExam.delete);
};