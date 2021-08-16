import "@babel/polyfill";
import { returnErrorResponse } from './util/ApiGatewayUtil';
import { handleUploadEvents, handleOptionsRequest, handleDownloadReport } from './controller/handler';
import { verifyToken } from './service/TokenService'

export const handler = async (event, context, callback) => {

  const path = event.path;
  const method = event.httpMethod;
  const headers = event.headers;

  if (method === 'OPTIONS') {
    return handleOptionsRequest(event, context, callback);
  }

  // const token = getBearerToken(headers);
  // let decodedToken = {};
  //
  // try {
  //   decodedToken = verifyToken(token);
  // } catch (error) {
  //   return returnErrorResponse(callback, 401, "Unauthorized");
  // }

  if (path === '/api/rest/view-events' && method === 'POST') {
    return handleUploadEvents(event, context, callback);
  } if (path.startsWith('/api/rest/view-events/') && method === 'GET') {
    return handleDownloadReport(event, context, callback);
  } else {
    return returnErrorResponse(callback, 404, 'Resource not found');
  }
};

const getBearerToken = (headers) => {
  const authHeader = headers.Authorization;
  return authHeader ? authHeader.replace('Bearer ', '') : authHeader;
}
