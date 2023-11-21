// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { addEventListener } from '~/src/eventListeners';
import { OnMessageDisplayedOutput } from '~/src/inAppMessaging/providers/pinpoint/types/outputs';
import { OnMessageDisplayedInput } from '~/src/inAppMessaging/providers/pinpoint/types/inputs';
import { assertIsInitialized } from '~/src/inAppMessaging/utils';
import { InAppMessagingValidationErrorCode } from '~/src/inAppMessaging/errors';

/**
 * Registers a callback that will be invoked on `messageDisplayed` events.
 *
 * @param {OnMessageDisplayedInput} input - The input object that holds the callback handler.
 * @throws validation: {@link InAppMessagingValidationErrorCode} - Thrown when the provided parameters or library
 * configuration is incorrect, or if In App messaging hasn't been initialized.
 * @returns {OnMessageDisplayedOutput} - An object that holds a remove method to stop listening to events.
 * @example
 * ```ts
 * onMessageDisplayed((message) => {
 *   // use the message
 * 	 console.log(message.id);
 * });
 * ```
 */
export function onMessageDisplayed(
	input: OnMessageDisplayedInput,
): OnMessageDisplayedOutput {
	assertIsInitialized();

	return addEventListener('messageDisplayed', input);
}
