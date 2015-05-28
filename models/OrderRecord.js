/**
 * Created by Jackey Li on 2015/5/17.
 */

var mongodb = require('./db'),
    BSON = require('mongodb').BSONPure;

var dataTableName = 'Order_Record';

var OrderRecord = function (order) {
    this.menuId = order.menuId;
    this.userId = order.userId;
    this.dateOrder = order.dateOrder;
    this.userName = order.userName;
    this.payStatus = order.payStatus;
    this.payWay = order.payWay;
    this.num = order.num;
};




module.exports = OrderRecord;

