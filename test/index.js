'use strict'

/* eslint-env mocha */
const fs = require('fs')
const path = require('path')

/**
 * TEST DEPENDECIES
 */
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const sinonChai = require('sinon-chai')
chai.use(chaiAsPromised)
chai.use(sinonChai)
const expect = chai.expect
const sinon = require('sinon')
const testOpenApi = fs.readFileSync(path.join(__dirname, './openapi.yaml'), 'utf-8')
const testAsyncApi = fs.readFileSync(path.join(__dirname, './asyncapi.yaml'), 'utf-8')
const gcpfunction = require('../lib/gcpFunction/index.js')

/**
 * LIBS TO BE STUBBED
 */
const {Storage} = require('@google-cloud/storage')
const axios = require('axios')
const widdershins = require('widdershins')
const openapiSnippet = require('../lib/openapiSnippet/')
const openapi2postman = require('../lib/openapi2postman')

describe('GCP Cloud Functions Tests', function () {
  const triggerInput = {name: 'test'}
  let deleteFileStub
  let fileStub
  let getFilesStub
  const gcpCallback = () => console.log('Called gcp callback')
  const originalLogFunction = console.log
  const originalLogInfoFunction = console.info
  const originalLogErrorFunction = console.error
  let consoleOutput = ''
  describe('onUpload...', function () {
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
      console.log = msg => {
        consoleOutput += msg + '\n'
      }
      console.info = msg => {
        consoleOutput += msg + '\n'
      }
      console.error = msg => {
        consoleOutput += msg + '\n'
      }
    })
    afterEach('restore stub', function () {
      this.sandbox.restore()
      console.log = originalLogFunction
      console.info = originalLogInfoFunction
      console.error = originalLogErrorFunction
      if (this.currentTest.state === 'failed') {
        console.log(consoleOutput)
      }
    })
    describe('for an OpenApi Spec...', function () {
      describe('with a badly formed input...', function () {
        it('rejects', function () {
          fileStub.returns({
            download: sinon.stub().resolves(['']),
            save: sinon.stub().resolves()
          })
          return expect(gcpfunction.onUpload(triggerInput, '', gcpCallback)).to.eventually.be.rejected
        })
      })
      describe('with a well formed input...', function () {
        it('resolves', function () {
          fileStub.returns({
            download: sinon.stub().resolves([testOpenApi]),
            save: sinon.stub().resolves()
          })
          return expect(gcpfunction.onUpload(triggerInput, '', gcpCallback)).to.eventually.be.fulfilled
        })
        it('still resolves if individual generators fails', function () {
          fileStub.returns({
            download: sinon.stub().resolves([testOpenApi]),
            save: sinon.stub().resolves()
          })
          this.sandbox.stub(widdershins, 'convert').rejects()
          this.sandbox.stub(openapiSnippet, 'generate').rejects()
          this.sandbox.stub(openapi2postman, 'convert').rejects()
          return expect(gcpfunction.onUpload(triggerInput, '', gcpCallback)).to.eventually.be.fulfilled
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
          return expect(gcpfunction.onUpload(triggerInput, '', gcpCallback)).to.eventually.be.rejected
        })
      })
      describe('with a well formed input...', function () {
        it('resolves', function () {
          fileStub.returns({
            download: sinon.stub().resolves([testAsyncApi]),
            save: sinon.stub().resolves()
          })
          return expect(gcpfunction.onUpload(triggerInput, '', gcpCallback)).to.eventually.be.fulfilled
        })
        it('still resolves if individual generators fails', function () {
          fileStub.returns({
            download: sinon.stub().resolves([testAsyncApi]),
            save: sinon.stub().resolves()
          })
          this.sandbox.stub(widdershins, 'convert').rejects()
          return expect(gcpfunction.onUpload(triggerInput, '', gcpCallback)).to.eventually.be.fulfilled
        })
      })
    })
  })

  describe('onDelete...', function () {
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
      console.log = msg => {
        consoleOutput += msg + '\n'
      }
      console.info = msg => {
        consoleOutput += msg + '\n'
      }
      console.error = msg => {
        consoleOutput += msg + '\n'
      }
    })
    afterEach('restore stub', function () {
      this.sandbox.restore()
      console.log = originalLogFunction
      console.info = originalLogInfoFunction
      console.error = originalLogErrorFunction
      if (this.currentTest.state === 'failed') {
        console.log(consoleOutput)
      }
    })
    describe('for an OpenApi Spec...', function () {
      it('invokes delete docs with the corresponding project folder name', function () {
        fileStub.returns({
          download: sinon.stub().resolves([testOpenApi]),
          save: sinon.stub().resolves()
        })
        return expect(gcpfunction.onDelete(triggerInput, '', gcpCallback)).to.eventually.be.fulfilled
      })
    })
    describe('for an AsyncApi Spec...', function () {
      it('invokes delete docs with the corresponding project folder name', function () {
        fileStub.returns({
          download: sinon.stub().resolves([testAsyncApi]),
          save: sinon.stub().resolves()
        })
        return expect(gcpfunction.onDelete(triggerInput, '', gcpCallback)).to.eventually.be.fulfilled
      })
    })
  })
})
