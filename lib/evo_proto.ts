import protobuf from 'protobufjs';
import { Request, ResetRequest } from './evolocity';

export const emptyRequest = () => {
  const RequestMessage: Request = {
    timestamp: 0,
    uid: 0,
    reset: {},
    config: undefined,
    energy: undefined,
    time: undefined,
    status: undefined,
  };

  return Request.encode(RequestMessage).finish();
};
