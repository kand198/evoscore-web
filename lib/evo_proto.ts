import { ConfigContent, Request, Response } from './proto/evolocity';

const emptyRequest: Request = {
  timestamp: 0,
  uid: 0,
  reset: undefined,
  config: undefined,
  energy: undefined,
  time: undefined,
  status: undefined,
};

export const getResetRequest = (): Request => {
  return { ...emptyRequest, reset: {} };
};

export const getConfigFetchRequest = (): Request => {
  return { ...emptyRequest, config: {} };
};

export const getConfigSetRequest = (content: ConfigContent): Request => {
  return { ...emptyRequest, config: { content } };
};

export const getEnergyRequest = (
  startTimestamp: number,
  endTimestamp: number
): Request => {
  return {
    ...emptyRequest,
    energy: { timestampPair: { startTimestamp, endTimestamp } },
  };
};

export const getTimeFetchRequest = (): Request => {
  return { ...emptyRequest, time: {} };
};

export const getTimeSetRequest = (time: number): Request => {
  return { ...emptyRequest, time: { time } };
};

export const getStatusRequest = (): Request => {
  return { ...emptyRequest, status: {} };
};

export const encodeRequest = (RequestMessage: Request) => {
  return Request.encode(RequestMessage).finish();
};

export const parseResponse = (ResponseArray: Uint8Array) => {
  return Response.decode(ResponseArray);
};
