'use strict';

import { ControllerUser } from '../controllers';
import { User } from '../models';
import { ValidatorUser, ValidationBase } from '../validations';
import { AuthMiddleware, RoleMiddleware } from '../middlwares';

const isAuth = AuthMiddleware.isAuth;
const isAdmin = RoleMiddleware.isValidRole(User.ROLE.ADMIN);
module.exports = (app, router) => {
    router
        .route('/login')
        .post([ValidatorUser.validateUsername], ControllerUser.login);

    router
        .route('/register')
        .post([ValidatorUser.validateSetPassword],ControllerUser.create);

    router
        .route('/user/change-password')
        .post([isAuth], ControllerUser.changePassword);

    router
        .route('/user/:id')
        .get(ControllerUser.getOne)
        .put([isAuth, ValidationBase.validateObjectId],ControllerUser.update)
        .delete([isAuth, ValidationBase.validateObjectId], ControllerUser.delete);

    router
        .route('/admin/users')
        .get([isAuth, isAdmin, ValidationBase.validatePagination],ControllerUser.getAllByAdmin);

};