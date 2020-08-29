import { ProviderDataAdaptable } from './ProviderDataAdapter';
import * as functions from 'firebase-functions';

export class Google implements ProviderDataAdaptable {
  createOptionsFor(bearer: string): { uri: string; qs?: any; headers?: any; auth?: any; json: boolean } {
    return {
      uri: `https://people.googleapis.com/v1/people/me`,
      qs: {
        personFields:
          'ageRange,addresses,biographies,birthdays,braggingRights,coverPhotos,emailAddresses,events,genders,imClients,interests,locales,memberships,metadata,names,nicknames,occupations,organizations,phoneNumbers,photos,relations,relationshipInterests,relationshipStatuses,residences,sipAddresses,skills,taglines,urls,userDefined',
        key: functions.config().google.key,
      },
      auth: {
        bearer,
      },
      json: true,
    };
  }

  map(providerResponse: any): any[] {
    return providerResponse;
  }
}
