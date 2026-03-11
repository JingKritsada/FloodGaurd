const { validationResult } = require('express-validator');
const { errMsg } = require('../utils/helper');

exports.validation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send(errMsg({
            code: 400,
            message: 'Validation failed',
            error: errors.array(),
        }));
    }
    next();
}