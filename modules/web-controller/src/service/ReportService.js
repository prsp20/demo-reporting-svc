import createCsvStringifier from 'csv-writer';

var AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-2'});
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const converter = AWS.DynamoDB.Converter;

export const createReport = async (guid) => {
  const items = await findViewEvents(guid);
  const csvStringifier = createCsvStringifier.createObjectCsvStringifier({
    header: [
      {id: 'rowNumber', title: 'Row Number'},
      {id: 'packageGuid', title: 'Package Guid'},
      {id: 'email', title: 'Email'},
      {id: 'clientSessionId', title: 'Client session ID'},
      {id: 'reportingId', title: 'Reporting ID'},
      {id: 'browser', title: 'Browser'},
      {id: 'device', title: 'Device'},
      {id: 'operatingSystem', title: 'Operating System'},
      {id: 'nonce', title: 'nonce'},
      {id: 'clientAddress', title: 'Client Address'},
      {id: 'userAgentString', title: 'User Agent String'}
    ]
  });

  return csvStringifier.stringifyRecords(items);
};

export const findViewEvents = async (packageGuid) => {
  const tableName = process.env.TABLE_NAME;
  var params = {
    ExpressionAttributeValues: {
      ":packageGuid": {
        S: packageGuid
      }
    },
    FilterExpression: "packageGuid = :packageGuid",
    TableName: tableName
  };

  const result = await ddb.scan(params).promise();

  let items = result.Items;
  if (items.length == 0) {
    return null;
  }

  let i = 1;
  return items.map(item => {
    let itemWithRowNumber = converter.unmarshall(item);
    itemWithRowNumber.rowNumber = i;
    i++;
  });
}
