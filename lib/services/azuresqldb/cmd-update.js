/* jshint camelcase: false */
/* jshint newcap: false */

// var async = require('async');
var util = require('util');
var Config = require('./service');
var common = require('../../common');
var log = common.getLogger(Config.name);


// Format of params to update credentials
// {
//     'parameters': {
//         'resourceGroupName': 'myRessourceGroup',
//         'sqlServerName': 'mySqlServer',
//         'sqlServerParameters': {
//             'properties': {
//                 'administratorLogin': 'newLoginUsername',
//                 'administratorLoginPassword': 'newPassword'
//             }
//         }
//     }
// }

var sqldbUpdate = function (params) {
    log.info(util.format('niroy5 sqldb cmd-update: params: %j', params));
    // var resourceGroupName = params.parameters.resourceGroup || '';
    // var sqlServerName = params.parameters.sqlServerName || '';
    // TODO validate params? resourceGroup and sqlServerName must be defined
    // TODO Get them automatically from 'parameters' field of 'instances' table of the database  

    this.update = function (next) {

        // Should not need to set params if simply changing broker db content
        // sqldbOperations.setParameters(resourceGroupName, sqlServerName, null);

        var newParams = { 
            'location': params.parameters.location,
            'sqlServerParameters': params.parameters['sqlServerParameters']
        };

        log.debug('sqldb cmd-update: newParams: %j', newParams);             

        // sqldbOperations.createOrUpdateServer(newParams, function resultHandler(err, result) {
        //    if (err) {
        //         log.error('sqldb cmd-update: final callback: err: %j', err);
        //     } else {
        //         log.info('sqldb cmd-update: final callback: result: %j', result);
        //     }
        //     return next(err, result);
        // });
        return next(null, {statusCode:200});
    };
};

module.exports = sqldbUpdate;
