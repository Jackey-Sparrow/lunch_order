/**
 * Created by Jackey Li on 2015/5/15.
 */

var mongodb = require('./db'),
    BSON = require('mongodb').BSONPure;

var User = function (user) {
    this.firstName = user.firstName;
    this.lastName = user.lastName;
};
User.prototype.AddOne = function (callback) {
    var user = {
        firstName: this.firstName,
        lastName: this.lastName
    };
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('User_Admin', function (err, collection) {
            if (err) {
                return callback(err);
            }
            collection.insert(
                user,
                {safe: true},
                function (err, newUser) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    callback(null, newUser[0]);
                }
            )
        });
    });
};

User.prototype.UpdateById = function (Id, callback) {
    Id = BSON.ObjectID.createFromHexString(Id);
    var user = {
        firstName: this.firstName,
        lastName: this.lastName
    };
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('user', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.update(
                {_id: Id},
                user,
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

User.DeleteById = function (Id, callback) {
    if (!Id) {
        return;
    }
    Id = BSON.ObjectID.createFromHexString(Id);
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('user', function (err, collection) {
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

User.getAll = function (callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('user', function (err, collection) {
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

module.exports = User;