
var util = require('util');
var _ = require('underscore');
var Config = require('./service');
var common = require('../../common');
var log = common.getLogger(Config.name);
var HttpStatus = require('http-status-codes');


var sqldbUpdate = function (params) {
    log.info(util.format('sqldb cmd-update created: params: %j', params));

    this.update = function (next) {

        var newParams = _.extend({}, params.currentParams, params.newParams); 

        log.debug('sqldb cmd-update: newParams: %j', newParams);

        // TODO if new parameters require changes to the cloud service, call azure api through client.js here
        var reply = { statusCode: HttpStatus.OK, code: HttpStatus.getStatusText(HttpStatus.OK), value: {} };
        return next(null, reply, newParams);
    };
};

module.exports = sqldbUpdate;
