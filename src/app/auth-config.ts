import {
  BrowserCacheLocation,
  Configuration,
  InteractionType,
  IPublicClientApplication,
  PublicClientApplication,
} from '@azure/msal-browser';
import { MsalGuardConfiguration, MsalInterceptorConfiguration } from '@azure/msal-angular';

const apiScope = 'api://5582b6c4-7ecd-4bed-9337-ba3f1f8e58e5/access_as_user';

export const loginRequest = {
  scopes: [apiScope],
};

export function msalInstanceFactory(): IPublicClientApplication {
  const configuration: Configuration = {
    auth: {
      clientId: '9e93805a-ed61-4fe8-8981-a839f016afc5',
      authority:
        'https://login.microsoftonline.com/3441157d-ea5c-483f-a66d-e45c3ed7f9da',
      redirectUri: window.location.origin,
    },
    cache: {
      cacheLocation: BrowserCacheLocation.SessionStorage,
    },
  };

  // MSAL Browser usa Authorization Code Flow con PKCE automáticamente para SPA.
  return new PublicClientApplication(configuration);
}

export function msalInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap: MsalInterceptorConfiguration['protectedResourceMap'] =
    new Map();

  protectedResourceMap.set(
    'https://ehj09v655m.execute-api.us-east-1.amazonaws.com/api/*',
    [apiScope],
  );

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
    strictMatching: true,
  };
}

export function msalGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: loginRequest,
  };
}
