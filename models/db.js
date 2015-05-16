/**
 * Created by Jackey Li on 2015/5/15.
 */

var setting = require('../settings'),
    mongodb = require('mongodb'),
    Db = mongodb.Db,
    Connect = mongodb.Connection,
    Server = mongodb.Server;

module.exports = new Db(
    setting.db,
    new Server(setting.host, setting.port),
    {safe: true}
);