# gcp-cf-docsgen

# [API Documentation Page](https://storage.cloud.google.com/gba-docs/index.html)

## Overview

GCP Cloud Function to generate and update documentation for the different projects of [Global Bridge App](https://github.com/online-bridge-hackathon/bridge-hackathon).

Triggered when a new/updated spec is uploaded to Global Bridge App's [gba-api bucket](https://storage.cloud.google.com/gba-api). Output documentation is uploaded to the [gba-docs bucket](https://storage.cloud.google.com/gba-docs).

A main HomePage is also rendered based on the specs currently active @gba-docs using a simple mustache template. See /templates/readme.html.md.mustache

Currently supports [OpenApi V3](https://www.openapis.org/) for REST APIs and [AsyncApi V2](https://www.asyncapi.com/) for Event Driven/Asynchronous APIs specifications.

* * *

## Current features

-   Renders a Main HomePage based on the current uploaded spec @gba-docs
-   Renders a slate/shin markdown page with code samples for each project
-   Renders an HTML page with code samples for each project
-   Auto links to a swagger/asyncapi playground with live "try-out"
-   Postman collections linkage

* * *

## CI/CD

This project's master branch is hooked to gcp's cloud build, getting deployed every time there's a push to master. See cloudbuild.yaml for specifics.

* * *

## Installation and Setup

### - REQUIREMENTS

    NodeJS (v12+)

### - PACKAGES

    npm install

* * *

## Tests

The accessible entry point(init) is tested against well formed and badly formed spec inputs, with virtually 100% coverage (GCP's SDK wrapped aren't covered).

    npm run test
    npm run coverage

* * *

## Docs

Generate docs for the [#Code-Documentation](#Code-Documentation) section of this readme

    npm run docs

* * *

## License

MIT

* * *

# Code-Documentation

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [init](#init)
    -   [Parameters](#parameters)
-   [parseSpec](#parsespec)
    -   [Parameters](#parameters-1)
    -   [saveFile](#savefile)
        -   [Parameters](#parameters-2)
    -   [downloadFile](#downloadfile)
        -   [Parameters](#parameters-3)
    -   [downloadBucket](#downloadbucket)
-   [genDocs](#gendocs)
    -   [Parameters](#parameters-4)
-   [widdershins](#widdershins)
    -   [Parameters](#parameters-5)
-   [openapi2Snippet](#openapi2snippet)
    -   [Parameters](#parameters-6)
-   [shins](#shins)
    -   [Parameters](#parameters-7)
-   [genMain](#genmain)

## init

GCP Cloud Function call method. 
Generates both the API documentation for a given spec (OpenApi-v3 or AsyncApi-v2) and the main page.

### Parameters

-   `file` **any** 
-   `context` **any** 
-   `callback` **any** 

## parseSpec

Parses and Validates an OpenApi v3 or AsyncApi v2 specification

### Parameters

-   `spec` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** OpenApi v3 or AsyncApi v2

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** A validated spec

### saveFile

Saves/Uploads file to DOCS GCP Bucket - GCP Node SDK

#### Parameters

-   `fileObject` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `fileObject.filePath` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
    -   `fileObject.data` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

### downloadFile

Downloads a file from API GCP Bucket - GCP Node SDK

#### Parameters

-   `filePath` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** File content

### downloadBucket

Downloads a file link object from API GCP Bucket - GCP Node SDK

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)>** GCP Bucket file-link-object array

## genDocs

Generates API Docs for a given spec

### Parameters

-   `spec` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** A Validated Spec (OpenApi v3 or AsyncApi v2)

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)>** Array of file objects in the form of {filePath, data}

## widdershins

Converts an API spec (OpenApi or AsyncApi) to Markdown

### Parameters

-   `spec` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** A Validated Spec (OpenApi v3 or AsyncApi v2)

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** Markdown convertion for a given spec

## openapi2Snippet

Enriches an OpenApi spec with code snippets

### Parameters

-   `openApi` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** An OpenApi v3 spec.

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** An OpenApi enriched spec

## shins

Converts a markdown string to slate format using shins

### Parameters

-   `markdownString` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** HTML Shins page

## genMain

Generates the main page

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** File object in the form of {filePath, data}
