const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  try{

    const year = event.year;
    const season = event.season;

    const params = {
      TableName : "TableTennis",
      KeyConditionExpression: "#year = :yyyy and #season = :season",
      ExpressionAttributeNames:{
        "#year": "year",
        "#season": "quarter"

      },
      ExpressionAttributeValues: {
        ":yyyy": year,
        ":season": season
      }
    };

    const body = await dynamo.query( params ).promise();
    console.log(body);;
    return body.Items[0]

  } catch ( err ) {
    console.log(err);
    throw new Error(" BAD THINGS HAPPENED");
  }
};
