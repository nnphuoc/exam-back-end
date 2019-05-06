'use strict';

import { ControllerCandidate } from '../controllers'
import { User } from '../models'
import { ValidationBase } from '../validations';
import { AuthMiddleware, RoleMiddleware } from '../middlwares';

const isAuth = AuthMiddleware.isAuth;

module.exports = (app, router) => {

    router
        .route('/candidate')
        .post([isAuth], ControllerCandidate.enterTheExam);

    router
        .route('/candidate/start/:id')
        .get([isAuth], ControllerCandidate.startTheExam);

    router
        .route('/candidate/test/:id')
        .put([isAuth], ControllerCandidate.testScope);
};