const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-west-2' });
const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
const converter = AWS.DynamoDB.Converter;
const tableName = process.env.TABLE_NAME;

export const logViewEvent = async (viewEvent) => {
  const convertedEvent = converter.marshall(viewEvent);

  const params = {
    TableName: tableName,
    ConditionExpression: 'attribute_not_exists(id)',
    Item: convertedEvent
  };

  await ddb.putItem(params).promise();
};

export const findViewEvents = async (packageGuid) => {
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

  return items.map(item => {
    let unmarshalledItem = converter.unmarshall(item);
    return unmarshalledItem;
  });
}
