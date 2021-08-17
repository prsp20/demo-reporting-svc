import { returnErrorResponse, returnResponse } from '../util/ApiGatewayUtil';
import { createReport } from '../service/ReportService';
import { logViewEvent } from '../dao/ViewEventDao';
import { getUuid } from '../util/util';

export const handleUploadEvents = async (event, context, callback) => {
  if (event.body === null) {
    return returnErrorResponse(callback, 400, 'Image is not provided');
  }

  const viewEvent = JSON.parse(event.body);
  viewEvent.id = getUuid();

  try {
    await logViewEvent(viewEvent);
    return returnResponse(callback, 200, { message: 'done' });
  } catch (error) {
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
  return returnResponse(callback, 200, { status: 'OK' });
};
