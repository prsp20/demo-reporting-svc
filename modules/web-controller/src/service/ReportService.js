import createCsvStringifier from 'csv-writer';

var AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-2'});
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const converter = AWS.DynamoDB.Converter;

export const createReport = async (guid) => {
  const items = await findViewEvents(guid);

  const csvStringifier = createCsvStringifier({
    header: [
      {id: 'name', title: 'NAME'},
      {id: 'lang', title: 'LANGUAGE'}
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

  return items.map(item => converter.unmarshall(item));
}
