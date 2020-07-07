---
layout: doc
title: Partner App Authorization
permalink: api/partner-app-authorization
date: 2019-09-08 8:14:30 +0600
post_image: assets/images/service-icon3.png
tags: [Profile]
toc: true
---
# Overview

The partner application authorization/deauthorization workflow allows developers to integrate their applications more closely with Signagelive by providing a seamless workflow to allow Signagelive network administrators to grant partner applications access to manage their networks directly from the calling application.

## Intended Audience

This document is intended to help Signagelive partners developing applications that integrate with Signagelive using the <a href="/api/network-api">Network API</a>.

## Prerequisites
Developers looking to integrate their applications with Signagelive should ensure they have been provided with the following:

1. Access to their own Signagelive test network
2. Partner application credentials, which at a minimum should include a:
 - Client ID
 - Client Secret

If you are a developer and have not been provided with access to your own network or credentials for your partner application and you are interested in integrating with Signagelive please reach out and join our <a href="https://signagelivedevelopers-signup.herokuapp.com/">Developer Slack Community</a> today.

# High Level Workflow

The diagram below shows at a high-level the intended workflow.

<img src="../../assets/images/api/SLPAA.png">

# Generating a Request Token

The calling application is expected to provide a request token which is passed on the query string when sending a request to authorize or deauthorize an application to Signagelive.

The token must be a <a href="https://jwt.io/">JSON Web Token<A> that is signed using the Client Secret and the HS256 (HMAC SHA256) algorithm. This provides a secure way to transmit both the request and response data and verify the identity of the sender. Note that the Client Secret should only ever be used to sign the token and should never be included in the token payload or query string.

JWTs (JSON Web Tokens) are an industry standard way to exchange information and as such there are a large number of libraries available for almost all languages and frameworks designed to make encoding, decoding, signing and verifying JWTs easier. Check the <a href="https://jwt.io/#libraries-io">jwt.io libraries page</a> for more information or to find a ready built library that you can use in your own application.

## Required Properties

The following properties must be included in the payload of the request token:

| Name        | Description                                        |
|-------------|----------------------------------------------------|
| clientId    | The clientId that you were provided by Signagelive |
| callbackUrl | The URL that the response will be forwarded to     |

Any request that is made that does not include both a clientId and callbackUrl within the payload of a valid, signed JWT will not pass validation and an error will be thrown (see Possible Error Response section).

Note that token payload property names are case sensitive.

## Additional Properties

As well as the required properties that must be included it is also possible to include additional properties in the payload that will be passed back to the calling application in the payload of the response token. This makes it easier for the calling application to associate the response back to the initial request by, for example, including a unique request identifier.

When including additional properties the token payload must not include any of the reserved property names documented in the next section.

## Reserved Property Names

The following is a list of reserved property names that should not be included in the request token payload:

- action
- status
- error
- errorMessage
- networkId
- authCode
- grantType

If one or more of these reserved properties are included in the request token payload an error will be thrown (see Possible Error Responses below).

Note that token payload property names are case sensitive.

## Handling the response

As long as a valid request token is provided, which contains a valid callback URL in its payload, Signagelive will send a consistent response to the calling application by redirecting the user to the callback URL when:

1. The request is approved, rejected or cancelled by the user
2. An error has has occurred

If the user does not complete the process Signagelive will not be able to provide a response back to the calling application and the calling application is expected to handle this. This may happen if the user closes their browser or if they browse away from Signagelive after initiating the request.

When Signagelive redirects the user to the callback URL the following parameters will be appended to the query string:

| Parameter Name | Description                                                                                                              |
|----------------|--------------------------------------------------------------------------------------------------------------------------|
| action         | The action that was attempted. Options are: [authorize, deauthorize]                                                     |
| status         | The status of the request: Options are: [approved, rejected, error]                                                      |
| error          | An error code in the form of a short string (see Possible Error Response below). Only included if an error has occurred. |
| message        | A human readable string representation of the error message. Only included if the an error has occurred.                 |
| token          | The response token provided by Signagelive                                                                               |

The response data above is included on the query string to make handling the different responses cases easier within the calling application and to ensure that the calling application can always determine the response status even if they are unable to access the payload of the response token.

The response token appended to the query string will also be a JWT that is signed with the calling application’s Client Secret using the HS256 algorithm* so it is possible for the calling application to verify that the response token was sent from Signagelive.

The response token payload will include all data that is passed back on the query string as well as:

- Network API access credentials for an approved request to authorize the partners application
- Any additional properties that were included in the request token payload

On receiving the response token the calling application is expected to decode and verify the token. If the response is an approved authorization then the response token payload will include:

- networkId
- clientId
- authCode
- grantType

The calling application should store these credentials along with the client secret that was used to sign and verify the token in order to authenticate requests made to the Network API in the future.

    * If the request made to Signagelive includes an invalid Client ID or Client Secret then the response token will not be signed using the calling application’s Client Secret.

## Possible Error Responses

The table below shows all possible error responses.

| Error                     | Description                                                                                   |
|---------------------------|-----------------------------------------------------------------------------------------------|
| token_not_provided        | A token was not provided on the query string with the request                                 |
| invalid_token             | The provided token is invalid                                                                 |
| token_verification_failed | The provided token failed verification                                                        |
| invalid_clientid          | The client id provided in the token payload was invalid                                       |
| reserved_property_used    | The token payload included a reserved property                                                |
| insufficient_permissions  | The user does not have the required permissions to authorize/deauthorize partner applications |
| unexpected                | An unexpected error occurred                                                                  |