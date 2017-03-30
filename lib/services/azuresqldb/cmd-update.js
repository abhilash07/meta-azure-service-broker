/* jshint camelcase: false */
/* jshint newcap: false */

// var async = require('async');
var util = require('util');

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

var sqldbUpdate = function (log, params) {
    log.info(util.format('niroy5 sqldb cmd-update: params: %j', params));
    var resourceGroupName = params.parameters.resourceGroup || '';
    var sqlServerName = params.parameters.sqlServerName || '';
    // TODO validate params? resourceGroup and sqlServerName must be defined
    // TODO Get them automatically from 'parameters' field of 'instances' table of the database  

    this.update = function (sqldbOperations, next) {

        sqldbOperations.setParameters(resourceGroupName, sqlServerName, null);

        var newParams = { 
            'location': params.parameters.location,
            'sqlServerParameters': params.parameters['sqlServerParameters']
        };

        log.debug('sqldb cmd-update: newParams: %j', newParams);                

        sqldbOperations.createOrUpdateServer(newParams, function resultHandler(err, result) {
           if (err) {
                log.error('sqldb cmd-update: final callback: err: %j', err);
            } else {
                log.info('sqldb cmd-update: final callback: result: %j', result);
            }
            return next(err, result);
        });
    };
};

module.exports = sqldbUpdate;
