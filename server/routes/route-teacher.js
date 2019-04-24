'use strict';

import { ControllerTeacher } from '../controllers';
import { User } from '../models';
import { ValidatorUser, ValidationBase } from '../validations';
import { AuthMiddleware, RoleMiddleware } from '../middlwares';

const isAdmin = RoleMiddleware.isValidRole(User.ROLE.ADMIN);
const isAuth = AuthMiddleware.isAuth;
const isOptionalAuth = AuthMiddleware.isOptionalAuth;
module.exports = (app, router) => {

    router
        .route('/teacher')
        .get([ValidationBase.validatePagination()], ControllerTeacher.getAll)
        .post([isAuth], ControllerTeacher.becomeTeacher);

    router
        .route('/teacher/check-slug')
        .post([isAuth], ControllerTeacher.checkSlug);

    router
        .route('/teacher/update-slug')
        .post([isAuth], ControllerTeacher.updateSlug());

    router
        .route('teacher/slug/:slug')
        .get([isOptionalAuth, ValidationBase.validateObjectId],ControllerTeacher.getTeacherBySlug);

    router
        .route('/admin/teacher')
        .get([isAuth, isAdmin, ValidationBase.validatePagination],ControllerTeacher.getAll());

    router
        .route('/admin/teacher/:id')
        .get([isAuth, isAdmin, ValidationBase.validateObjectId],ControllerTeacher.getOne);

    router
        .route('/teacher/:id')
        .put([isAuth, ValidationBase.validateObjectId], ControllerTeacher.update)
        .delete([isAuth, ValidationBase.validateObjectId], ControllerTeacher.delete);
};