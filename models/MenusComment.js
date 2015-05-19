/**
 * Created by Jackey Li on 2015/5/16.
 */

var mongodb = require('./db'),
    BSON = require('mongodb').BSONPure;

var dataTableName = 'Menus_Comment';

var MenusComment = function (desc) {
    this.menuId = desc.menuId;
    this.userName = desc.userName;
    this.dateInsert = desc.dateInsert;
    this.desc = desc.desc;
};

module.exports = MenusComment;

