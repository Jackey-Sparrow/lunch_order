/**
 * Created by Jackey Li on 2015/5/19.
 */
var mongodb = require('./db'),
    mongodbNew = require('mongodb'),
    BSON = require('mongodb').BSONPure,
    http = require('http'),
    poolModule = require('generic-pool');

var pool = poolModule.Pool({
    name: 'mongodb',
    create: function (callback) {
        var server_options = {'auto_reconnect': false, poolSize: 1};
        var db_options = {w: -1};
        var mongoserver = new mongodbNew.Server('localhost', 27017, server_options);
        var db = new mongodbNew.Db('lunchOrder', mongoserver, db_options);
        db.open(function (err, db) {
            if (err)return callback(err);
            callback(null, db);
        });
    },
    destroy: function (db) {
        db.close();
    },
    max: 10,//max Concurrent quantity
    idleTimeoutMillis: 30000,
    log: false
});

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

    pool.acquire(function (err, db) {
        if (err) {
            return callback(err);
        } else {

            db.collection(dataTableName).insert(
                item,
                {safe: true},
                function (err, newItems) {
                    if (err) {
                        return callback(err);
                    }
                    callback(null, newItems[0]);
                    pool.release(db);
                }
            );

        }
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

    pool.acquire(function (err, db) {
        if (err) {
            return callback(err);
        } else {
            db.collection(dataTableName).findOne(filter, function (err, menu) {
                callback(null, menu);
                pool.release(db);
            });
        }
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
    pool.acquire(function (err, db) {
        if (err) {
            return callback(err);
        } else {

            db.collection(dataTableName).find(filter).toArray(function (err, docs) {
                //callback(null, JSON.stringify(docs, null, 2));
                callback(null, docs);
                pool.release(db);
            });
        }
    });
};

/**
 * get all items
 *
 * @param dataTableName
 * @param callback
 */
ModelBasicClass.getAll = function (dataTableName, callback) {
    pool.acquire(function (err, db) {
        if (err) {
            return callback(err);
        } else {

            db.collection(dataTableName).find().toArray(function (err, docs) {
                callback(null, docs);
                pool.release(db);
            });
        }
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
