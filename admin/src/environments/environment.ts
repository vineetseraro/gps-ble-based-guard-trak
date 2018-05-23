// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

  region: '', // region

  identityPoolId: '', // pool id
  projectId: '',// user pool id
  clientId: '', // aws account id 
  userPoolClientId: '', // user poll app id

  growlErrorHeadingMessage: 'Error Message',
  nameMaxLength: 50,
  codeMaxLength: 25,
  successMsgTime: 2000,

  accessKeyId: '', 
  secretAccessKey: '', 

  server: 'https://guardtrakapi.akwa.io/',
  serverEnv: '/api',


  cloudinaryUploaderOptions: {
    url: '',
    autoUpload: true,
    isHTML5: true,
    removeAfterUpload: true,
    headers: [
      {
        name: 'X-Requested-With',
        value: 'XMLHttpRequest'
      }
    ]
  },

  cloudinaryPreset: '',

  refreshSession: 5, // mins

  defaultConfig: {
    numRows: '10',
    dateFormat: 'MM/DD/YYYY',
    dateTimeFormat: 'MM/DD/YYYY HH:mm',
    timeZone: 'US/Eastern',
    measurementUnit: 'Metric',
    temperatureUnit: 'celsius',
    refreshMapInterval: '300'
  },

  cloudinaryImageOptions: {
    largeImageSize: 'w_500,h_500,c_limit',
    thumbImageSize: 'w_100,h_100,c_limit'
  },

  orderStatus: {
    'Draft': 5,
    'Open': 10,
    'PartialShipped': 25,
    'Shipped': 40,
    'PartialDelivered': 45,
    'Delivered': 60,
    'Canceled': 70,
    'Submitted': 80,
    'Closed': 90
  },

  shipmentStatus: {
    'Open': 10,
    'Scheduled': 20,
    'PartialShipped': 25,
    'SoftShipped': 30,
    'Shipped': 40,
    'PartialDelivered': 45,
    'SoftDelivered': 50,
    'Delivered': 60,
    'Canceled': 70,
    'Closed': 90
  },

  itemStatus: {
    'Open': 10,
    'Scheduled': 20,
    'SoftShipped': 30,
    'Shipped': 40,
    'SoftDelivered': 50,
    'Delivered': 60,
    'Canceled': 70,
    'Closed': 90
  },

  calDtFormatsMapping: {
    'MM/DD/YYYY': 'mm/dd/yy',
    'MM-DD-YYYY': 'mm.dd.yy',
    'DD/MM/YYYY': 'dd/mm/yy',
    'DD-MM-YYYY': 'dd-mm-yy',
    'YYYYY/DD/MM': 'yy/dd/mm',
    'YYYYY-DD-MM': 'yy-dd-mm',
    'DD Mon YYYY': 'dd M yy',
    'DD Month YYYY': 'dd MM yy'
  },

  calDtTmFormatsMapping: {
    'MM/DD/Y HH:mm': 'mm/dd/yy',
    'MM-DD-Y HH:mm': 'mm.dd.yy',
    'DD/MM/Y HH:mm': 'dd/mm/yy',
    'DD-MM-Y HH:mm': 'dd-mm-yy',
    'Y/DD/MM HH:mm': 'yy/dd/mm',
    'Y-DD-MM HH:mm': 'yy-dd-mm',
    'DD MMM Y HH:mm': 'dd M yy',
    'DD MMMM Y HH:mm': 'dd MM yy'
  },

  discardReasons: {
    '': 'Select Discard Reason',
    'noise': 'Noise',
    'invalidType': 'Field Type/value',
    'duplicate': 'Duplicate'
  },

  iotTopics: {
    product: 'ak-guardtrak-productTracking',
    shipment: 'ak-guardtrak-shipmentTracking',
    device: 'ak-guardtrak-deviceTracking',
    user: 'ak-guardtrak-userTracking'
  },
  adminRole: 'role-guardtrak-akadmin',
  userType: 'Guard',

  mapDateTimeFormat: 'y MMM d HH:mm:s'

};
