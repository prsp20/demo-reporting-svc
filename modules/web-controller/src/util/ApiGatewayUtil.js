export const returnErrorResponse = (callback, statusCode, message) => {
  return returnResponse(callback, statusCode, { message: message });
};

export const returnResponse = (callback, statusCode, body) => {
  return callback(null, {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT',
      'Access-Control-Allow-Headers': 'Content-Type,Content-Length,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
    },
    body: JSON.stringify(body)
  });
};