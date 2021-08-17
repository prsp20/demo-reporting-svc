import { createObjectCsvStringifier } from 'csv-writer';
import { findViewEvents } from '../dao/ViewEventDao';

export const createReport = async (guid) => {
  const items = await findViewEvents(guid);
  const csvStringifier = createObjectCsvStringifier({
    header: [
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

  return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(items);
};
