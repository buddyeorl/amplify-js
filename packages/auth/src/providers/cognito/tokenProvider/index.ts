import {
	AuthTokens,
	KeyValueStorageInterface,
	MemoryKeyValueStorage,
	TokenProvider,
} from '@aws-amplify/core';
import { DefaultTokenStore } from './TokenStore';
import { TokenOrchestrator } from './TokenOrchestrator';
import { CognitoUserPoolTokenRefresher } from '../apis/tokenRefresher';

const authTokenStore = new DefaultTokenStore();
authTokenStore.setKeyValueStorage(MemoryKeyValueStorage);
const tokenOrchestrator = new TokenOrchestrator();
tokenOrchestrator.setAuthTokenStore(authTokenStore);
tokenOrchestrator.setTokenRefresher(CognitoUserPoolTokenRefresher);
interface CognitoUserPoolTokenProviderType extends TokenProvider {
	setKeyValueStorage: (keyValueStorage: KeyValueStorageInterface) => void;
}

export const CognitoUserPoolsTokenProvider: CognitoUserPoolTokenProviderType = {
	getTokens: ({
		forceRefresh,
	}: {
		forceRefresh?: boolean;
	}): Promise<AuthTokens> => {
		return tokenOrchestrator.getTokens({ options: { forceRefresh } });
	},
	setKeyValueStorage: (keyValueStorage: KeyValueStorageInterface): void => {
		authTokenStore.setKeyValueStorage(keyValueStorage);
	},
};

export { tokenOrchestrator };