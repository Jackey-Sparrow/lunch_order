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

OrderRecord.prototype.AddRecord = function (callback) {
    var order = {
        menuId: parseInt(this.menuId),
        userId: this.userId,
        dateOrder: this.dateOrder,
        userName: this.userName,
        payStatus: this.payStatus,
        payWay: this.payWay,
        num: 1
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

OrderRecord.updateOrder = function (record, callback) {
    //Id = BSON.ObjectID.createFromHexString(Id);

    //var order = {
    //    payStatus: this.payStatus,
    //    payWay: this.payWay,
    //    num: this.num
    //};
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(dataTableName, function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.update(
                {_id: record._id},
                record,
                {upsert: true, multi: false},
                function (err, result) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    callback(null, result);
                }
            );
        })
    });
};

OrderRecord.getTodayOrderByFilter = function (filter, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(dataTableName, function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.find(filter).toArray(function (err, docs) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, docs);
            });
        });
    });
};


module.exports = OrderRecord;

