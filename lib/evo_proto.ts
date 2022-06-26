import {
  ConfigContent,
  EnergyRequest,
  Request,
  Response,
  VehicleClass,
} from './proto/evolocity';

const emptyRequest: Request = {
  timestamp: 0,
  uid: 0,
  reset: undefined,
  config: undefined,
  energy: undefined,
  time: undefined,
  status: undefined,
};

const getResetRequest = (): Request => {
  return { ...emptyRequest, reset: {} };
};

const getConfigFetchRequest = (): Request => {
  return { ...emptyRequest, config: {} };
};

const getConfigSetRequest = (content: ConfigContent): Request => {
  return { ...emptyRequest, config: { content } };
};

const getEnergyRequest = (
  startTimestamp: number,
  endTimestamp: number
): Request => {
  return {
    ...emptyRequest,
    energy: { timestampPair: { startTimestamp, endTimestamp } },
  };
};

const getTimeFetchRequest = (): Request => {
  return { ...emptyRequest, time: {} };
};

const getTimeSetRequest = (time: number): Request => {
  return { ...emptyRequest, time: { time } };
};

const getStatusRequest = (time: number): Request => {
  return { ...emptyRequest, status: {} };
};

export const encodeRequest = (RequestMessage: Request) => {
  return Request.encode(RequestMessage).finish();
};

export const parseResponse = (ResponseArray: Uint8Array) => {
  return Response.decode(ResponseArray);
};
