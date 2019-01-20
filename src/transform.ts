import { ITripdata } from './volkswagen';

export function convertTo2dArray(data: ITripdata[]) {
  return data.map(value => Object.values(value));
}

export function discardEarlierValues(latestId: string, data: ITripdata[]) {
  const latestIdNum = Number(latestId);
  return data.filter(value => Number(value.vehicleStatisticsId) > latestIdNum);
}
/**
 * Removes tripDate since dateTime also exists.
 */
export function deleteDate(data: ITripdata[]) {
  return data.map(value => {
    delete value.tripDate;
    return value;
  });
}
