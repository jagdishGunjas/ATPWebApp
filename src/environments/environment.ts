// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  proxyurl : 'https://cors-anywhere.herokuapp.com/',
  apiBaseUrl: 'http://76.8.25.92:9222/sap/opu/odata/sap/',
  authUrl: 'http://76.8.25.92:9222/sap/opu/odata/sap/ZGW_FI_APPROVAL_API_SRV/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
