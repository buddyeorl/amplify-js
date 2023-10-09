// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Cache, BrowserStorageCache } from '@aws-amplify/core';
import { isBrowser } from '@aws-amplify/core/internals/utils';
import {
	resolveCachedSession,
	updateCachedSession,
} from '../../../../src/providers/personalize/utils';

jest.mock('@aws-amplify/core');
jest.mock('@aws-amplify/core/internals/utils');

describe('Analytics service provider Personalize utils: cachedSession', () => {
	const sessionIdCacheKey = '_awsct_sid.personalize';
	const userIdCacheKey = '_awsct_uid.personalize';
	const mockCache = Cache as jest.Mocked<typeof BrowserStorageCache>;
	const mockIsBrowser = isBrowser as jest.Mock;

	const mockSession = {
		sessionId: 'sessionId0',
		userId: 'userId0',
	};

	const mockCachedStorage = {
		[userIdCacheKey]: mockSession.userId,
		[sessionIdCacheKey]: mockSession.sessionId,
	};

	beforeEach(() => {
		mockCache.getItem.mockImplementation(key => mockCachedStorage[key]);
		mockIsBrowser.mockReturnValue(false);
	});

	afterEach(() => {
		mockIsBrowser.mockReset();
		mockCache.getItem.mockReset();
		mockCache.setItem.mockReset();
	});

	it('resolve cached session from Cache', () => {
		const result = resolveCachedSession('trackingId0');
		expect(result).toStrictEqual(mockSession);
	});

	it('create a new session if there is no cache', () => {
		mockCache.getItem.mockImplementation(() => undefined);
		const result = resolveCachedSession('trackingId0');
		expect(result.sessionId).not.toBe(mockSession.sessionId);
		expect(result.sessionId.length).toBeGreaterThan(0);
		expect(result.userId).toBe(undefined);
	});

	it('updateCachedSession create a new session if user has changed', () => {
		updateCachedSession('newUserId', mockSession.sessionId, mockSession.userId);
		expect(mockCache.setItem).toBeCalledTimes(2);
		expect(mockCache.setItem).toHaveBeenNthCalledWith(
			1,
			sessionIdCacheKey,
			expect.any(String),
			expect.any(Object)
		);
		expect(mockCache.setItem).toHaveBeenNthCalledWith(
			2,
			userIdCacheKey,
			'newUserId',
			expect.any(Object)
		);
	});

	it('updateCachedSession create a new session if user is signed out', () => {
		updateCachedSession(undefined, mockSession.sessionId, undefined);
		expect(mockCache.setItem).toBeCalledTimes(2);
		expect(mockCache.setItem).toHaveBeenNthCalledWith(
			1,
			sessionIdCacheKey,
			expect.any(String),
			expect.any(Object)
		);
		expect(mockCache.setItem).toHaveBeenNthCalledWith(
			2,
			userIdCacheKey,
			undefined,
			expect.any(Object)
		);
	});

	it('updateCachedSession create a new session if no cached session', () => {
		updateCachedSession('newUserId', undefined, mockSession.userId);
		expect(mockCache.setItem).toBeCalledTimes(2);
		expect(mockCache.setItem).toHaveBeenNthCalledWith(
			1,
			sessionIdCacheKey,
			expect.any(String),
			expect.any(Object)
		);
		expect(mockCache.setItem).toHaveBeenNthCalledWith(
			2,
			userIdCacheKey,
			'newUserId',
			expect.any(Object)
		);
	});

	it('updateCachedSession only updates userId if cached sessionId but no cached userId', () => {
		updateCachedSession('newUserId', mockSession.sessionId, undefined);
		expect(mockCache.setItem).toBeCalledTimes(1);
		expect(mockCache.setItem).toHaveBeenNthCalledWith(
			1,
			userIdCacheKey,
			'newUserId',
			expect.any(Object)
		);
	});
});