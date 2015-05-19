/**
 * Created by Jackey Li on 2015/5/15.
 */

var mongodb = require('./db'),
    BSON = require('mongodb').BSONPure;

var dataTableName = 'User_Admin';

var User = function (user) {
    this.userName = user.userName;
    this.password = user.password;
};

module.exports = User;