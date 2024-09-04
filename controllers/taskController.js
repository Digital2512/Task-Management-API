const Task = require('../models/TaskModel');
const {validationResult} = require('express-validator');

exports.createTask = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return
    }
}