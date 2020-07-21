'use strict'

/* eslint-env mocha */
const proxyquire = require('proxyquire')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const sinonChai = require('sinon-chai')
chai.use(chaiAsPromised)
chai.use(sinonChai)
const expect = chai.expect
const sinon = require('sinon')
const gcpfunction = require('../gcpfunction.js')
const parseSpec = require('../lib/parseSpec')
const {downloadBucket, downloadFile, saveFile} = require('../lib/gcpBucket')
const genDocs = require('../lib/genDocs')
const genMain = require('../lib/genMain')
const openapiSnippet = require('../lib/openapiSnippet')
const shins = require('../lib/shins')
const widdershins = require('../lib/widdershins')

describe('GCP Cloud function flow test', function () {
  let parseSpecStub
  let downloadBucketStub
  let saveFileStub
  let downloadFileStub
  let genDocsStub
  let genMainStub
  let openapiSnippetStub
  let shinsStub
  let widdershinsStub
  beforeEach('initialize service stubs', function () {
    this.sandbox = sinon.createSandbox()
    parseSpecStub = this.sandbox.stub(parseSpec)
    downloadBucketStub = this.sandbox.stub(downloadBucket)
    saveFileStub = this.sandbox.stub(saveFile)
    downloadFileStub = this.sandbox.stub(downloadFile)
    genDocsStub = this.sandbox.stub(genDocs)
    genMainStub = this.sandbox.stub(genMain)
    openapiSnippetStub = this.sandbox.stub(openapiSnippet)
    shinsStub = this.sandbox.stub(shins)
    widdershinsStub = this.sandbox.stub(widdershins)
  })
  afterEach('restore stub', function () {
    this.sandbox.restore()
  })
  describe('with a badly formed spec...', function () {
    it('rejects', function () {
      parseSpecStub.rejects()
      downloadBucketStub.resolves()
      saveFileStub.resolves()
      downloadFileStub.resolves()
      genDocsStub.resolves()
      genMainStub.resolves()
      openapiSnippetStub.resolves()
      shinsStub.resolves()
      widdershinsStub.resolves()
      return expect(gcpfunction()).to.eventually.be.rejected
    })
  })
  describe('with a well formed input...', function () {
    parseSpecStub.resolves()
    downloadBucketStub.resolves()
    saveFileStub.resolves()
    downloadFileStub.resolves()
    genDocsStub.resolves()
    genMainStub.resolves()
    openapiSnippetStub.resolves()
    shinsStub.resolves()
    widdershinsStub.resolves()
    it('resolves', function () {
      return expect(gcpfunction()).to.eventually.be.fulfilled
    })
  })
})
