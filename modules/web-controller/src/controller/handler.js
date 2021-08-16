import {returnErrorResponse, returnResponse} from '../util/ApiGatewayUtil';
import {getUuid} from '../util/util';

var AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-2'});
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

export const handleUploadEvents = async (event, context, callback) => {

  if (event.body === null) {
    return returnErrorResponse(callback, 400, 'Image is not provided');
  }

  let body = JSON.parse(event.body);
  body.id = getUuid();

  const tableName = process.env.TABLE_NAME;
  const params = {
    TableName: tableName,
    Item: body
  };

  console.log(body);
  try {
    await ddb.putItem(params).promise();
    return returnResponse(callback, 200, {message: "done"})
  } catch (error) {
    console.log(error.message);
    console.log(error.message);
    return returnErrorResponse(callback, 500, 'View event log failed');
  }
};

export const handleOptionsRequest = (event, context, callback) => {
  return returnResponse(callback, 200, {status: 'OK'});
};
