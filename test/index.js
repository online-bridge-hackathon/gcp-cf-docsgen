'use strict'

/* eslint-env mocha */
const fs = require('fs')
const path = require('path')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const sinonChai = require('sinon-chai')
chai.use(chaiAsPromised)
chai.use(sinonChai)
const expect = chai.expect
const sinon = require('sinon')
const testOpenApi = fs.readFileSync(path.join(__dirname, './openapi.yaml'), 'utf-8')
const testAsyncApi = fs.readFileSync(path.join(__dirname, './asyncapi.yaml'), 'utf-8')
const gcpfunction = require('../gcpfunction.js')
const gcpBucket = require('../lib/gcpBucket')

describe('GCP Cloud function flow test', function () {
  let downloadBucketStub
  let saveFileStub
  let downloadFileStub
  beforeEach('initialize service stubs', function () {
    this.sandbox = sinon.createSandbox()
    downloadBucketStub = this.sandbox.stub(gcpBucket, 'downloadBucket')
    saveFileStub = this.sandbox.stub(gcpBucket, 'saveFile')
    downloadFileStub = this.sandbox.stub(gcpBucket, 'downloadFile')
  })
  afterEach('restore stub', function () {
    this.sandbox.restore()
  })
  describe('for an OpenApi Spec...', function () {
    describe('with a badly formed input...', function () {
      it('rejects', function () {
        downloadBucketStub.resolves(['filetest'])
        saveFileStub.resolves()
        downloadFileStub.resolves('')
        return expect(gcpfunction.init('test', '', () => console.log('finished'))).to.eventually.be.rejected
      })
    })
    describe('with a well formed input...', function () {
      it('resolves', function () {
        downloadBucketStub.resolves(['filetest'])
        saveFileStub.resolves()
        downloadFileStub.resolves(testOpenApi)
        return expect(gcpfunction.init('test', '', () => console.log('finished'))).to.eventually.be.fulfilled
      })
    })
  })
  describe('for an AsyncApi Spec...', function () {
    describe('with a badly formed input...', function () {
      it('rejects', function () {
        downloadBucketStub.resolves(['filetest'])
        saveFileStub.resolves()
        downloadFileStub.resolves('')
        return expect(gcpfunction.init('test', '', () => console.log('finished'))).to.eventually.be.rejected
      })
    })
    describe('with a well formed input...', function () {
      it('resolves', function () {
        downloadBucketStub.resolves(['filetest'])
        saveFileStub.resolves()
        downloadFileStub.resolves(testAsyncApi)
        return expect(gcpfunction.init('test', '', () => console.log('finished'))).to.eventually.be.fulfilled
      })
    })
  })

})
