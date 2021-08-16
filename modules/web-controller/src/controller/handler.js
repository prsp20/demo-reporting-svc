import { returnErrorResponse, returnResponse } from '../util/ApiGatewayUtil';
import { getUuid } from '../util/util';
var multipart = require('parse-multipart');
var AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-west-2' });
var s3 = new AWS.S3({ apiVersion: '2006-03-01' });

export const handleUploadImage = async (event, context, callback) => {

    if (event.body === null) {
        return returnErrorResponse(callback, 400, 'Image is not provided');
    }

    let decodedImage = Buffer.from(event.body, 'base64');
    const boundary = multipart.getBoundary(event.headers['content-type']);
    const parts = multipart.Parse(decodedImage, boundary);
    const firstFile = parts[0];

    const fileExtension = firstFile.filename.split('.').pop();
    const fileName = getUuid() + '.' + fileExtension;

    var params = {
        "Body": firstFile.data,
        "Bucket": "destination-images",
        "Key": fileName,
        "ContentType": firstFile.type
    };

    try {
        const result = await s3.upload(params).promise();
        return returnResponse(callback, 200, { imageUrl: 'https://destination-images.s3.eu-west-2.amazonaws.com/' + fileName })
    } catch (error) {
        return returnErrorResponse(callback, 500, 'Image upload failed');
    }
};

export const handleOptionsRequest = (event, context, callback) => {
    return returnResponse(callback, 200, {status: 'OK'});
};