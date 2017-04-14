/* jshint camelcase: false */
/* jshint newcap: false */
/* global describe, before, it */

var HttpStatus = require('http-status-codes');
var should = require('should');
var sinon = require('sinon');
var cmdUpdate = require('../../../../lib/services/azuresqldb/cmd-update');
var azuresqldb = require('../../../../lib/services/azuresqldb');
var EventEmitter = require('events');
var Handlers, Common;

var mockingHelper = require('../mockingHelper');
mockingHelper.backup();

// var sqldbOps = new sqldbOperations(azure);

describe('SqlDb - Update', function () {
    
    var validParams = {
        'instance': {
            'azureInstanceId': 'azure-sqldb-user-mysqlsvr-mydb',
            'status': 'success',
            'timestamp': '2017-03-24T04:51:49.466Z',
            'instance_id': 'aa4d7eff-70af-4637-bf5e-398ebaf1ac2c',
            'service_id': 'fb9bc99e-0aa9-11e6-8a8a-000d3a002ed5',
            'plan_id': '3819fdfa-0aaa-11e6-86f4-000d3a002ed5',
            'organization_guid': 'b499ecff-378e-4e48-ae13-6e027ac9edf4',
            'space_guid': 'fba5706c-74c2-448d-9fc7-ce3f0500557e',
            'parameters': {
                'location': 'westus',
                'resourceGroup': 'user-rg1',
                'sqlServerName': 'user-mysqlsvr',
                'sqlServerParameters': {
                    'allowSqlServerFirewallRules': [
                    {
                        'endIpAddress': '167.220.1.0',
                        'ruleName': 'MS',
                        'startIpAddress': '167.220.0.0'
                    }
                    ],
                    'properties': {
                        'administratorLogin': 'user',
                        'administratorLoginPassword': 'currentPassword425'
                    }
                },
                'sqldbName': 'mydb',
                'sqldbParameters': {
                    'properties': {
                        'collation': 'SQL_Latin1_General_CP1_CI_AS'
                    }
                },
                'transparentDataEncryption': true
            },
            'last_operation': 'provision',
            'provisioning_result': {
                'tags': {
                    'user-agent': 'meta-azure-service-broker'
                },
                'id': '/subscriptions/e5839dfd-61f0-4b2f-b06f-de7fc47b5998/resourceGroups/user-rg1/providers/Microsoft.Sql/servers/user-mysqlsvr/databases/mydb',
                'name': 'mydb',
                'type': 'Microsoft.Sql/servers/databases',
                'location': 'West US',
                'kind': 'v12.0,user',
                'properties': {
                    'databaseId': '7ee66e8f-32bd-46d9-8a6a-a67ef166080b',
                    'edition': 'Basic',
                    'status': 'Online',
                    'serviceLevelObjective': 'Basic',
                    'collation': 'SQL_Latin1_General_CP1_CI_AS',
                    'maxSizeBytes': '2147483648',
                    'creationDate': '2017-03-24T04:50:43.32Z',
                    'currentServiceObjectiveId': 'dd6d99bb-f193-4ec1-86f2-43d3bccbc49c',
                    'requestedServiceObjectiveId': 'dd6d99bb-f193-4ec1-86f2-43d3bccbc49c',
                    'requestedServiceObjectiveName': 'Basic',
                    'sampleName': null,
                    'defaultSecondaryLocation': 'East US',
                    'earliestRestoreDate': '2017-03-24T05:01:15.533Z',
                    'elasticPoolName': null,
                    'containmentState': 2,
                    'readScale': 'Disabled',
                    'failoverGroupId': null
                },
                'operation': 'CreateLogicalDatabase',
                'startTime': '/Date(1490331043055+0000)/',
                'resourceGroup': 'user-rg1',
                'sqlServerName': 'user-mysqlsvr',
                'fullyQualifiedDomainName': 'user-mysqlsvr.database.windows.net',
                'administratorLogin': 'user',
                'administratorLoginPassword': 'currentPassword425'
            }
        },
        'requested': {
            'parameters': {
                'sqlServerParameters': {
                    'properties': {
                        'administratorLogin': 'user',
                        'administratorLoginPassword': 'newPassword425'
                    }
                }
            },
            'accepts_incomplete': 'true',
        },
        'service_id': 'fb9bc99e-0aa9-11e6-8a8a-000d3a002ed5'
    };
    
    var sqldbUpdate; 
    
    describe('cmd-update', function(){
        before(function () {
            sqldbUpdate = new cmdUpdate(validParams);
        });
        
        after(function () { });
        
        
        it('should not exist error', function (done) {
            sqldbUpdate.update(function updateCallback(err, result) {
                should.not.exist(err);
                result.should.deepEqual({ statusCode: HttpStatus.OK, code: HttpStatus.getStatusText(HttpStatus.OK), value: {} });
                done();
            });
        });
    });
    
    
    describe('index.update', function(){
        before(function () {
            sinon.spy(azuresqldb, 'update');
        });
        
        after(function(){
            azuresqldb.update.restore();
        });
        
        it('should not exist error', function(done){
            var callback = sinon.spy();
            azuresqldb.update(validParams, callback);
            azuresqldb.update.calledOnce.should.be.true();
            callback.calledOnce.should.be.true();
            callback.calledWithExactly(null, { statusCode: HttpStatus.OK});
            done();
        });
    });
    

    var config = {
        'azure': {
            'environment': 'ENVIRONMENT',
            'subscriptionId': 'SUBSCRIPTION_ID',
            'tenantId': 'TENANT_ID',
            'clientId': 'CLIENT_ID',
            'clientSecret': 'CLIENT_SECRET',
        },
        'serviceBroker': {
            'credentials': {
                'authUser': 'SECURITY_USER_NAME',
                'authPassword': 'SECURITY_USER_PASSWORD'
            }
        },
        'database': {
            'provider': 'AZURE_BROKER_DATABASE_PROVIDER',
            'server': 'AZURE_BROKER_DATABASE_SERVER',
            'user': 'AZURE_BROKER_DATABASE_USER',
            'password': 'AZURE_BROKER_DATABASE_PASSWORD',
            'database': 'AZURE_BROKER_DATABASE_NAME',
            'encryptionKey': 'AZURE_BROKER_DATABASE_ENCRYPTION_KEY'
        },
        'privilege': {
            'sqldb': {
                'allowToCreateSqlServer': 'true'
            }
        },
        'accountPool': {
            'sqldb': {
            }
        },
        'defaultSettings': {
            'sqldb': {
                'transparentDataEncryption': 'true'
            }
        }
    };

    var getConfigStub;


    beforeEach(function(){
        // Need to mock common.getConfigurations before requiring api-handlers or else it throws at require time
        Common = require('../../../../lib/common');
        getConfigStub = sinon.stub(Common, 'getConfigurations').returns(config);
        Handlers = require('../../../../lib/broker/v2/api-handlers');
    });

    afterEach(function(){
        getConfigStub.restore();
    });


    describe('Broker.HandleUpdateRequest', function(){

        var broker;
        var res;        
        var req = {
            params: {
                'instance_id': 'aa4d7eff-70af-4637-bf5e-398ebaf1ac2c',
                'parameters': {
                    'sqlServerParameters': {
                        'properties': {
                            'administratorLogin': 'niroy',
                            'administratorLoginPassword': 'newPassword425'
                        }
                    }
                }
            },
            connection:{
                remoteAddress: 'REMOTE_ADDRESS',
                remotePort:1234
            }
        };


        before(function() {
            broker = new EventEmitter();
            var updateServiceInstanceStub = sinon.stub().yields(null);
            var getServiceInstanceStub = sinon.stub().yields(null, { service_id: 'myServiceUUID' });
            var setServiceInstanceStub = sinon.stub().yields(null);

            broker.db = {
                getServiceInstance: getServiceInstanceStub,
                setServiceInstance: setServiceInstanceStub,
                updateServiceInstanceProvisioningPendingResult: updateServiceInstanceStub
            };
            broker.on('update-myServiceUUID', azuresqldb.update);
            // sinon.stub(broker, 'db.getServiceInstance').returns({hello:'world'});
            res = {
                send:sinon.spy()
            };
        });

        after(function() {
        });

        it('should not exist error', function(done){
            // (broker, req, res, done)
            Handlers.handleUpdateRequest(broker, req, res, done);
        });

        it('should return 200 code on success', function () {
            var done = sinon.spy();
            Handlers.handleUpdateRequest(broker, req, res, done);
            res.send.calledOnce.should.be.true();
            res.send.calledWithExactly(200, {});
        });
    });
});
