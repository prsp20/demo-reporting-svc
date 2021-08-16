import stringify from 'csv-stringify';

var AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-2'});
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const converter = AWS.DynamoDB.Converter;

export const createReport = async (guid) => {
  const someData = [
    {
      "Country": "Nigeria",
      "Population": "200m",
      "Continent": "Africa",
      "Official Language(s)": "English"
    },
    {
      "Country": "India",
      "Population": "1b",
      "Continent": "Asia",
      "Official Language(s)": "Hindi, English"
    },
    {
      "Country": "United States of America",
      "Population": "328m",
      "Continent": "North America",
      "Official Language": "English"
    },
    {
      "Country": "United Kingdom",
      "Population": "66m",
      "Continent": "Europe",
      "Official Language": "English"
    },
    {
      "Country": "Brazil",
      "Population": "209m",
      "Continent": "South America",
      "Official Language": "Portugese"
    }
  ]

  const data = await stringify(someData, {header: true});
  return data;
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

  return items;
}
