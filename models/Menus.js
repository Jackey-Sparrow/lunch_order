/**
 * Created by Jackey Li on 2015/5/15.
 */

var mongodb = require('./db'),
    BSON = require('mongodb').BSONPure;

var dataTableName = 'Menus';

var Menus = function (menu) {
    this.id = menu.id;
    this.name = menu.name;
    this.price = menu.price;
    this.imageUrl = menu.imageUrl;
    this.desc = menu.desc;
    this.isHot = menu.isHot;
    this.isSpecialty = menu.isSpecialty;
    this.dataTableName = 'Menus';
};

module.exports = Menus;