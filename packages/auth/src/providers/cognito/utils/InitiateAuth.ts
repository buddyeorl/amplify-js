// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
	buildHttpRpcRequest,
	cognitoUserPoolTransferHandler,
	defaultConfig,
	getSharedHeaders,
} from './clients/base';
import { composeServiceApi } from '@aws-amplify/core/internals/aws-client-utils/composers';
import type {
	InitiateAuthCommandInput,
	InitiateAuthCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';
import {
	Endpoint,
	HttpRequest,
	HttpResponse,
	parseJsonBody,
	parseJsonError,
	parseMetadata,
} from '@aws-amplify/core/internals/aws-client-utils';

const initiateAuthSerializer = (
	input: InitiateAuthCommandInput,
	endpoint: Endpoint
): HttpRequest => {
	const headers = getSharedHeaders('InitiateAuth');
	const body = JSON.stringify(input);
	return buildHttpRpcRequest(endpoint, headers, body);
};

const initiateAuthDeserializer = async (
	response: HttpResponse
): Promise<InitiateAuthCommandOutput> => {
	if (response.statusCode >= 300) {
		const error = await parseJsonError(response);
		throw error;
	} else {
		const body = await parseJsonBody(response);
		return {
			$metadata: parseMetadata(response),
			AuthenticationResult: body.AuthenticationResult,
			ChallengeParameters: body.ChallengeParameters,
		};
	}
};

/**
 * @internal
 */
export const initiateAuth = composeServiceApi(
	cognitoUserPoolTransferHandler,
	initiateAuthSerializer,
	initiateAuthDeserializer,
	defaultConfig
);