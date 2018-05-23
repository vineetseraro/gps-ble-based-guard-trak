const configurationHandler = require('../handlers/configuration');

exports.routeConfiguration = function(event, context, callback) {
  switch (event.httpMethod.toUpperCase()) {
    case 'GET':
      configurationHandler.getConfigurations(event, context, callback);
      break;
    case 'PUT':
      configurationHandler.updateConfiguration(event, context, callback);
      break;
    default:
  }
};
