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
const {Storage} = require('@google-cloud/storage')
const axios = require('axios')

describe('onUpload...', function () {
  let getFilesStub
  let fileStub
  this.timeout(20000)
  beforeEach('initialize service stubs', function () {
    this.sandbox = sinon.createSandbox()
    this.sandbox.stub(axios, 'put').resolves()
    getFilesStub = this.sandbox.stub().resolves([['filetest']])
    fileStub = this.sandbox.stub()
    this.sandbox.stub(Storage.prototype, 'bucket').callsFake(() => ({
      getFiles: getFilesStub,
      file: fileStub
    }))
  })
  afterEach('restore stub', function () {
    this.sandbox.restore()
  })
  describe('for an OpenApi Spec...', function () {
    describe('with a badly formed input...', function () {
      it('rejects', function () {
        fileStub.returns({
          download: sinon.stub().resolves(['']),
          save: sinon.stub().resolves()
        })
        return expect(gcpfunction.onUpload('test', '', () => console.log('finished'))).to.eventually.be.rejected
      })
    })
    describe('with a well formed input...', function () {
      it('resolves', function () {
        fileStub.returns({
          download: sinon.stub().resolves([testOpenApi]),
          save: sinon.stub().resolves()
        })
        return expect(gcpfunction.onUpload('test', '', () => console.log('finished'))).to.eventually.be.fulfilled
      })
    })
  })
  describe('for an AsyncApi Spec...', function () {
    describe('with a badly formed input...', function () {
      it('rejects', function () {
        fileStub.returns({
          download: sinon.stub().resolves(['']),
          save: sinon.stub().resolves()
        })
        return expect(gcpfunction.onUpload('test', '', () => console.log('finished'))).to.eventually.be.rejected
      })
    })
    describe('with a well formed input...', function () {
      it('resolves', function () {
        fileStub.returns({
          download: sinon.stub().resolves([testAsyncApi]),
          save: sinon.stub().resolves()
        })
        return expect(gcpfunction.onUpload('test', '', () => console.log('finished'))).to.eventually.be.fulfilled
      })
    })
  })
})

describe('onDelete...', function () {
  let deleteFileStub
  let fileStub
  let getFilesStub
  beforeEach('initialize service stubs', function () {
    this.sandbox = sinon.createSandbox()
    fileStub = this.sandbox.stub()
    deleteFileStub = this.sandbox.stub().resolves()
    getFilesStub = this.sandbox.stub().resolves([['filetest']])
    this.sandbox.stub(Storage.prototype, 'bucket').callsFake(() => ({
      getFiles: getFilesStub,
      deleteFiles: deleteFileStub,
      file: fileStub
    }))
  })
  afterEach('restore stub', function () {
    this.sandbox.restore()
  })
  describe('for an OpenApi Spec...', function () {
    it('invokes delete docs with the corresponding project folder name', function () {
      fileStub.returns({
        download: sinon.stub().resolves([testOpenApi]),
        save: sinon.stub().resolves()
      })
      return expect(gcpfunction.onDelete('test', '', () => console.log('finished'))).to.eventually.be.fulfilled
    })
  })
  describe('for an AsyncApi Spec...', function () {
    it('invokes delete docs with the corresponding project folder name', function () {
      fileStub.returns({
        download: sinon.stub().resolves([testAsyncApi]),
        save: sinon.stub().resolves()
      })
      return expect(gcpfunction.onDelete('test', '', () => console.log('finished'))).to.eventually.be.fulfilled
    })
  })
})
