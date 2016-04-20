/* jshint camelcase: false */
/* jshint newcap: false */

'use strict';

var _ = require('underscore');
var Config = require('./service');
var cmdPoll = require('./cmd-poll');
var cmdProvision = require('./cmd-provision');
var cmdDeprovision = require('./cmd-deprovision');
var redisClient = require('./client');
var resourceGroupClient = require('../../common/resourceGroup-client');
var Reply = require('../../common/reply');

var Handlers = {};

Handlers.catalog = function(log, params, next) {
    var reply = Config;
    next(null, reply);
};

Handlers.provision = function(log, params, next) {

    log.muteOnly('debug');

    log.debug('Redis Cache/index/provision/params: %j', params);
    
    var cp = new cmdProvision(log, params);
    if (!cp.allValidatorsSucceed()) {
        var reply = Reply(500); reply.value.description = 'Input validators failed.';
        var err = new Error('Validation failed.'); err.code = 500;
        next(err, reply, null);
        return;
    }

    resourceGroupClient.instantiate(params.azure);
    redisClient.instantiate(params.azure);
    cp.provision(redisClient, resourceGroupClient, function(err, result) {
        if (err) {
            var statusCode = null; if (_.has(err, 'statusCode')) statusCode = err.statusCode;
            var reply = Reply(500, statusCode, err.code);
            if (reply.statusCode === 500) err.statusCode = 500;
            next(err, reply, result);
        } else {
            next(null, Reply(202), result);
        }
    });
};

Handlers.poll = function(log, params, next) {

    log.muteOnly('debug');

    log.debug('Redis Cache/index/poll/params: %j', params);
    
    var provisioningResult = JSON.parse(params.provisioning_result);

    var cp = new cmdPoll(log, params);
    if (!cp.allValidatorsSucceed()) {
        var reply = Reply(500); reply.value.description = 'Input validators failed.';
        var err = new Error('Validation failed.'); err.code = 500;
        next(err, reply, provisioningResult);
        return;
    }

    redisClient.instantiate(params.azure);
    cp.poll(redisClient, function(err, result) {

        if (err) {
            var statusCode = null; if (_.has(err, 'statusCode')) statusCode = err.statusCode;
            var reply = Reply(500, statusCode, err.code);
            if (reply.statusCode === 500) err.statusCode = 500;
            next(err, reply, provisioningResult);
        } else {
            next(null, result, provisioningResult);
        }
    });
};

Handlers.deprovision = function(log, params, next) {

    log.muteOnly('debug');

    log.debug('Redis Cache/index/deprovision/params: %j', params);
    
    var provisioningResult = JSON.parse(params.provisioning_result);

    var cp = new cmdDeprovision(log, params);
    if (!cp.allValidatorsSucceed()) {
        var reply = Reply(500); reply.value.description = 'Input validators failed.';
        var err = new Error('Validation failed.'); err.code = 500;
        next(err, reply, provisioningResult);
        return;
    }

    redisClient.instantiate(params.azure);
    cp.deprovision(redisClient, function(err, result) {

        if (err) {
            var statusCode = null; if (_.has(err, 'statusCode')) statusCode = err.statusCode;
            var reply = Reply(500, statusCode, err.code);
            if (reply.statusCode === 500) err.statusCode = 500;
            next(err, reply, result);
        } else {
            next(null, Reply(202), result);
        }
    });
};

Handlers.bind = function(log, params, next) {

    log.debug('Redis Cache/index/bind/params: %j', params);
    
    var provisioningResult = JSON.parse(params.provisioning_result);

    // contents of reply.value winds up in VCAP_SERVICES
    var reply = {
        statusCode: 201,
        code: 'Created',
        value: {
            credentials: {
                name: provisioningResult.name,
                hostname: provisioningResult.hostName,
                port: provisioningResult.port,
                sslPort: provisioningResult.sslPort,
                primaryKey: provisioningResult.accessKeys.primaryKey,
                secondaryKey: provisioningResult.accessKeys.secondaryKey
            }
        }
    };

    next(null, reply, {});
};

Handlers.unbind = function(log, params, next) {

    log.debug('Redis Cache/index/unbind/params: %j', params);
    
    var reply = {
        statusCode: 200,
        code: 'OK',
        value: {},
    };
    var result = {};
    next(null, reply, result);
};

module.exports = Handlers;