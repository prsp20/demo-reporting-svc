import {returnErrorResponse, returnResponse} from '../util/ApiGatewayUtil';
import {createReport} from '../service/ReportService';

import {getUuid} from '../util/util';

var AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-2'});
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const converter = AWS.DynamoDB.Converter;

export const handleUploadEvents = async (event, context, callback) => {

  if (event.body === null) {
    return returnErrorResponse(callback, 400, 'Image is not provided');
  }

  let body = JSON.parse(event.body);
  body.id = getUuid();

  const convertedEvent = converter.marshall(body);

  const tableName = process.env.TABLE_NAME;
  var params = {
    TableName: tableName,
    ConditionExpression: 'attribute_not_exists(id)',
    Item: convertedEvent
  };

  try {
    await ddb.putItem(params).promise();
    return returnResponse(callback, 200, {message: "done"})
  } catch (error) {
    console.log(error.message);
    return returnErrorResponse(callback, 500, 'View event log failed');
  }
};

export const handleDownloadReport = async (event, context, callback) => {
  const guid = event.pathParameters.guid;
  const data = await createReport(guid);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT',
      'Access-Control-Allow-Headers': 'Content-Type,Content-Length,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename=' + guid + '.csv'
    },
    body: data
  };
};

export const handleOptionsRequest = (event, context, callback) => {
  return returnResponse(callback, 200, {status: 'OK'});
};
