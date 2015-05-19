/**
 * Created by Jackey Li on 2015/5/19.
 */
var mongodb = require('./db'),
    BSON = require('mongodb').BSONPure;

/**
 * basic class for find / add / update / delete item
 *
 * @constructor
 */
var ModelBasicClass = function () {
};

/**
 * add new item
 *
 * @param item
 * @param dataTableName
 * @param callback
 */
ModelBasicClass.addItem = function (item, dataTableName, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(dataTableName, function (err, collection) {
            if (err) {
                return callback(err);
            }
            collection.insert(
                item,
                {safe: true},
                function (err, newItems) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    callback(null, newItems[0]);
                }
            )
        });
    });
};

/**
 * find one item by filter
 *
 * @param filter
 * @param dataTableName
 * @param callback
 */
ModelBasicClass.getItemByFilter = function (filter, dataTableName, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }

        db.collection(dataTableName, function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }

            collection.findOne(filter, function (err, menu) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                callback(null, menu);//成功！返回查询的用户信息
            });
        });
    });
};

/**
 * find items by filter
 *
 * @param filter
 * @param dataTableName
 * @param callback
 */
ModelBasicClass.getItemsByFilter = function (filter, dataTableName, callback) {
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

/**
 * get all items
 *
 * @param dataTableName
 * @param callback
 */
ModelBasicClass.getAll = function (dataTableName, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(dataTableName, function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.find().toArray(function (err, docs) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, docs);
            });
        });
    });
};

/**
 * delete item by id
 *
 * @param Id
 * @param dataTableName
 * @param callback
 * @constructor
 */
ModelBasicClass.DeleteItemById = function (Id, dataTableName, callback) {
    if (!Id) {
        return;
    }
    Id = BSON.ObjectID.createFromHexString(Id);
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(dataTableName, function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.remove({_id: Id}, function (err, result) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                return callback(null, result);
            });
        });
    });
};


module.exports = ModelBasicClass;
