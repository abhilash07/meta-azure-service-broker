/* jshint camelcase: false */
/* jshint newcap: false */
/* global describe, before, it */

var HttpStatus = require('http-status-codes');
var should = require('should');
var sinon = require('sinon');
var cmdUpdate = require('../../../../lib/services/azuresqldb/cmd-update');
var azuresqldb = require('../../../../lib/services/azuresqldb');

var mockingHelper = require('../mockingHelper');
mockingHelper.backup();

// var sqldbOps = new sqldbOperations(azure);

describe('SqlDb - Update', function () {

    var validParams = {
        instance_id: 'e2778b98-0b6b-11e6-9db3-000d3a002ed5',
        service_id: 'fb9bc99e-0aa9-11e6-8a8a-000d3a002ed5', // azure-sqldb
        plan_id: '3819fdfa-0aaa-11e6-86f4-000d3a002ed5', // basic plan
        parameters: {
            resourceGroup: 'sqldbResourceGroup',
            sqlServerName: 'golive4',
            sqlServerCreateIfNotExist: true,
            sqlServerParameters: {
                location: 'westus',
                properties: {
                    administratorLogin: 'newLogin',
                    administratorLoginPassword: 'newPassword'
                }
            }
        }
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
                result.should.deepEqual({ statusCode: HttpStatus.OK });
                done();
            });
        });
    });


    describe('Handlers.update', function(){
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
});
