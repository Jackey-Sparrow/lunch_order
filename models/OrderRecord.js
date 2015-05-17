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
    this.payWay = this.payWay;
};

OrderRecord.prototype.AddRecord = function (callback) {
    var order = {
        menuId: parseInt(this.menuId),
        userId: this.userId,
        dateOrder: this.dateOrder,
        userName: this.userName,
        payStatus: this.payStatus,
        payWay: this.payWay
    };
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(dataTableName, function (err, collection) {
            if (err) {
                return callback(err);
            }
            collection.insert(
                order,
                {safe: true},
                function (err, newOrder) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    callback(null, newOrder[0]);
                }
            )
        });
    });
};

module.exports = OrderRecord;

