'use strict';

import { ControllerSubject } from '../controllers';
import { User } from '../models';
import { ValidationBase } from '../validations';
import { AuthMiddleware, RoleMiddleware } from '../middlwares';

const isAuth = AuthMiddleware.isAuth;
const isAdmin = RoleMiddleware.isValidRole(User.ROLE.ADMIN);

module.exports = (app, router) => {

    router
        .route('/subjects')
        .get([ValidationBase.validatePagination], ControllerSubject.getAll);

    router
        .route('/admin/subject')
        .post([isAuth, isAdmin], ControllerSubject.create);

    router
        .route('/admin/subject/:id')
        .put([isAuth, isAdmin, ValidationBase.validateObjectId], ControllerSubject.create)
        .delete([isAuth, isAdmin, ValidationBase.validateObjectId], ControllerSubject.delete);
};