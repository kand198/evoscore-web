/* eslint-disable */
import * as _m0 from 'protobufjs/minimal';

export const protobufPackage = '';

/** Content */
export enum VehicleClass {
  STANDARD = 0,
  OPEN = 1,
  COMPETITION = 2,
  UNRECOGNIZED = 3,
}

export function vehicleClassFromJSON(object: any): VehicleClass {
  switch (object) {
    case 0:
    case 'STANDARD':
      return VehicleClass.STANDARD;
    case 1:
    case 'OPEN':
      return VehicleClass.OPEN;
    case 2:
    case 'COMPETITION':
      return VehicleClass.COMPETITION;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return VehicleClass.UNRECOGNIZED;
  }
}

export function vehicleClassToJSON(object: VehicleClass): string {
  switch (object) {
    case VehicleClass.STANDARD:
      return 'STANDARD';
    case VehicleClass.OPEN:
      return 'OPEN';
    case VehicleClass.COMPETITION:
      return 'COMPETITION';
    case VehicleClass.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED';
  }
}

/** Requests */
export interface Request {
  timestamp: number;
  uid: number;
  reset: ResetRequest | undefined;
  config: ConfigRequest | undefined;
  energy: EnergyRequest | undefined;
  time: TimeRequest | undefined;
  status: StatusRequest | undefined;
}

export interface ResetRequest {}

export interface ConfigRequest {
  content?: ConfigContent | undefined;
}

export interface TimestampPair {
  startTimestamp: number;
  endTimestamp: number;
}

export interface EnergyRequest {
  timestampPair?: TimestampPair | undefined;
}

export interface TimeRequest {
  time?: number | undefined;
}

export interface StatusRequest {}

/** Responses */
export interface Response {
  timestamp: number;
  uid: number;
  ack: Ack | undefined;
  config: ConfigResponse | undefined;
  energy: EnergyResponse | undefined;
  time: TimeResponse | undefined;
  status: StatusResponse | undefined;
}

export interface Ack {}

export interface ConfigResponse {
  content: ConfigContent | undefined;
}

export interface EnergyFrame {
  endTimestamp: number;
  averageVoltage: number;
  averageCurrent: number;
}

export interface EnergyResponse {
  frames: EnergyFrame[];
}

export interface TimeResponse {}

export interface StatusResponse {
  uptime: number;
  flashUsage: number;
  temperature: number;
  voltage: number;
  current: number;
}

export interface ConfigContent {
  serialNumber: number;
  teamNumber: number;
  vehicleClass?: VehicleClass | undefined;
}

function createBaseRequest(): Request {
  return {
    timestamp: 0,
    uid: 0,
    reset: undefined,
    config: undefined,
    energy: undefined,
    time: undefined,
    status: undefined,
  };
}

export const Request = {
  encode(
    message: Request,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.timestamp !== 0) {
      writer.uint32(8).uint32(message.timestamp);
    }
    if (message.uid !== 0) {
      writer.uint32(16).uint32(message.uid);
    }
    if (message.reset !== undefined) {
      ResetRequest.encode(message.reset, writer.uint32(26).fork()).ldelim();
    }
    if (message.config !== undefined) {
      ConfigRequest.encode(message.config, writer.uint32(34).fork()).ldelim();
    }
    if (message.energy !== undefined) {
      EnergyRequest.encode(message.energy, writer.uint32(42).fork()).ldelim();
    }
    if (message.time !== undefined) {
      TimeRequest.encode(message.time, writer.uint32(50).fork()).ldelim();
    }
    if (message.status !== undefined) {
      StatusRequest.encode(message.status, writer.uint32(58).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Request {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.timestamp = reader.uint32();
          break;
        case 2:
          message.uid = reader.uint32();
          break;
        case 3:
          message.reset = ResetRequest.decode(reader, reader.uint32());
          break;
        case 4:
          message.config = ConfigRequest.decode(reader, reader.uint32());
          break;
        case 5:
          message.energy = EnergyRequest.decode(reader, reader.uint32());
          break;
        case 6:
          message.time = TimeRequest.decode(reader, reader.uint32());
          break;
        case 7:
          message.status = StatusRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Request {
    return {
      timestamp: isSet(object.timestamp) ? Number(object.timestamp) : 0,
      uid: isSet(object.uid) ? Number(object.uid) : 0,
      reset: isSet(object.reset)
        ? ResetRequest.fromJSON(object.reset)
        : undefined,
      config: isSet(object.config)
        ? ConfigRequest.fromJSON(object.config)
        : undefined,
      energy: isSet(object.energy)
        ? EnergyRequest.fromJSON(object.energy)
        : undefined,
      time: isSet(object.time) ? TimeRequest.fromJSON(object.time) : undefined,
      status: isSet(object.status)
        ? StatusRequest.fromJSON(object.status)
        : undefined,
    };
  },

  toJSON(message: Request): unknown {
    const obj: any = {};
    message.timestamp !== undefined &&
      (obj.timestamp = Math.round(message.timestamp));
    message.uid !== undefined && (obj.uid = Math.round(message.uid));
    message.reset !== undefined &&
      (obj.reset = message.reset
        ? ResetRequest.toJSON(message.reset)
        : undefined);
    message.config !== undefined &&
      (obj.config = message.config
        ? ConfigRequest.toJSON(message.config)
        : undefined);
    message.energy !== undefined &&
      (obj.energy = message.energy
        ? EnergyRequest.toJSON(message.energy)
        : undefined);
    message.time !== undefined &&
      (obj.time = message.time ? TimeRequest.toJSON(message.time) : undefined);
    message.status !== undefined &&
      (obj.status = message.status
        ? StatusRequest.toJSON(message.status)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Request>, I>>(object: I): Request {
    const message = createBaseRequest();
    message.timestamp = object.timestamp ?? 0;
    message.uid = object.uid ?? 0;
    message.reset =
      object.reset !== undefined && object.reset !== null
        ? ResetRequest.fromPartial(object.reset)
        : undefined;
    message.config =
      object.config !== undefined && object.config !== null
        ? ConfigRequest.fromPartial(object.config)
        : undefined;
    message.energy =
      object.energy !== undefined && object.energy !== null
        ? EnergyRequest.fromPartial(object.energy)
        : undefined;
    message.time =
      object.time !== undefined && object.time !== null
        ? TimeRequest.fromPartial(object.time)
        : undefined;
    message.status =
      object.status !== undefined && object.status !== null
        ? StatusRequest.fromPartial(object.status)
        : undefined;
    return message;
  },
};

function createBaseResetRequest(): ResetRequest {
  return {};
}

export const ResetRequest = {
  encode(
    _: ResetRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ResetRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseResetRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): ResetRequest {
    return {};
  },

  toJSON(_: ResetRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ResetRequest>, I>>(
    _: I
  ): ResetRequest {
    const message = createBaseResetRequest();
    return message;
  },
};

function createBaseConfigRequest(): ConfigRequest {
  return { content: undefined };
}

export const ConfigRequest = {
  encode(
    message: ConfigRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.content !== undefined) {
      ConfigContent.encode(message.content, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ConfigRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConfigRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.content = ConfigContent.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ConfigRequest {
    return {
      content: isSet(object.content)
        ? ConfigContent.fromJSON(object.content)
        : undefined,
    };
  },

  toJSON(message: ConfigRequest): unknown {
    const obj: any = {};
    message.content !== undefined &&
      (obj.content = message.content
        ? ConfigContent.toJSON(message.content)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ConfigRequest>, I>>(
    object: I
  ): ConfigRequest {
    const message = createBaseConfigRequest();
    message.content =
      object.content !== undefined && object.content !== null
        ? ConfigContent.fromPartial(object.content)
        : undefined;
    return message;
  },
};

function createBaseTimestampPair(): TimestampPair {
  return { startTimestamp: 0, endTimestamp: 0 };
}

export const TimestampPair = {
  encode(
    message: TimestampPair,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.startTimestamp !== 0) {
      writer.uint32(8).uint32(message.startTimestamp);
    }
    if (message.endTimestamp !== 0) {
      writer.uint32(16).uint32(message.endTimestamp);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TimestampPair {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTimestampPair();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.startTimestamp = reader.uint32();
          break;
        case 2:
          message.endTimestamp = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TimestampPair {
    return {
      startTimestamp: isSet(object.startTimestamp)
        ? Number(object.startTimestamp)
        : 0,
      endTimestamp: isSet(object.endTimestamp)
        ? Number(object.endTimestamp)
        : 0,
    };
  },

  toJSON(message: TimestampPair): unknown {
    const obj: any = {};
    message.startTimestamp !== undefined &&
      (obj.startTimestamp = Math.round(message.startTimestamp));
    message.endTimestamp !== undefined &&
      (obj.endTimestamp = Math.round(message.endTimestamp));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TimestampPair>, I>>(
    object: I
  ): TimestampPair {
    const message = createBaseTimestampPair();
    message.startTimestamp = object.startTimestamp ?? 0;
    message.endTimestamp = object.endTimestamp ?? 0;
    return message;
  },
};

function createBaseEnergyRequest(): EnergyRequest {
  return { timestampPair: undefined };
}

export const EnergyRequest = {
  encode(
    message: EnergyRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.timestampPair !== undefined) {
      TimestampPair.encode(
        message.timestampPair,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EnergyRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEnergyRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.timestampPair = TimestampPair.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EnergyRequest {
    return {
      timestampPair: isSet(object.timestampPair)
        ? TimestampPair.fromJSON(object.timestampPair)
        : undefined,
    };
  },

  toJSON(message: EnergyRequest): unknown {
    const obj: any = {};
    message.timestampPair !== undefined &&
      (obj.timestampPair = message.timestampPair
        ? TimestampPair.toJSON(message.timestampPair)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<EnergyRequest>, I>>(
    object: I
  ): EnergyRequest {
    const message = createBaseEnergyRequest();
    message.timestampPair =
      object.timestampPair !== undefined && object.timestampPair !== null
        ? TimestampPair.fromPartial(object.timestampPair)
        : undefined;
    return message;
  },
};

function createBaseTimeRequest(): TimeRequest {
  return { time: undefined };
}

export const TimeRequest = {
  encode(
    message: TimeRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.time !== undefined) {
      writer.uint32(8).uint32(message.time);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TimeRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTimeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.time = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TimeRequest {
    return {
      time: isSet(object.time) ? Number(object.time) : undefined,
    };
  },

  toJSON(message: TimeRequest): unknown {
    const obj: any = {};
    message.time !== undefined && (obj.time = Math.round(message.time));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TimeRequest>, I>>(
    object: I
  ): TimeRequest {
    const message = createBaseTimeRequest();
    message.time = object.time ?? undefined;
    return message;
  },
};

function createBaseStatusRequest(): StatusRequest {
  return {};
}

export const StatusRequest = {
  encode(
    _: StatusRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StatusRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStatusRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): StatusRequest {
    return {};
  },

  toJSON(_: StatusRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<StatusRequest>, I>>(
    _: I
  ): StatusRequest {
    const message = createBaseStatusRequest();
    return message;
  },
};

function createBaseResponse(): Response {
  return {
    timestamp: 0,
    uid: 0,
    ack: undefined,
    config: undefined,
    energy: undefined,
    time: undefined,
    status: undefined,
  };
}

export const Response = {
  encode(
    message: Response,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.timestamp !== 0) {
      writer.uint32(8).uint32(message.timestamp);
    }
    if (message.uid !== 0) {
      writer.uint32(16).uint32(message.uid);
    }
    if (message.ack !== undefined) {
      Ack.encode(message.ack, writer.uint32(26).fork()).ldelim();
    }
    if (message.config !== undefined) {
      ConfigResponse.encode(message.config, writer.uint32(34).fork()).ldelim();
    }
    if (message.energy !== undefined) {
      EnergyResponse.encode(message.energy, writer.uint32(42).fork()).ldelim();
    }
    if (message.time !== undefined) {
      TimeResponse.encode(message.time, writer.uint32(50).fork()).ldelim();
    }
    if (message.status !== undefined) {
      StatusResponse.encode(message.status, writer.uint32(58).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Response {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.timestamp = reader.uint32();
          break;
        case 2:
          message.uid = reader.uint32();
          break;
        case 3:
          message.ack = Ack.decode(reader, reader.uint32());
          break;
        case 4:
          message.config = ConfigResponse.decode(reader, reader.uint32());
          break;
        case 5:
          message.energy = EnergyResponse.decode(reader, reader.uint32());
          break;
        case 6:
          message.time = TimeResponse.decode(reader, reader.uint32());
          break;
        case 7:
          message.status = StatusResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Response {
    return {
      timestamp: isSet(object.timestamp) ? Number(object.timestamp) : 0,
      uid: isSet(object.uid) ? Number(object.uid) : 0,
      ack: isSet(object.ack) ? Ack.fromJSON(object.ack) : undefined,
      config: isSet(object.config)
        ? ConfigResponse.fromJSON(object.config)
        : undefined,
      energy: isSet(object.energy)
        ? EnergyResponse.fromJSON(object.energy)
        : undefined,
      time: isSet(object.time) ? TimeResponse.fromJSON(object.time) : undefined,
      status: isSet(object.status)
        ? StatusResponse.fromJSON(object.status)
        : undefined,
    };
  },

  toJSON(message: Response): unknown {
    const obj: any = {};
    message.timestamp !== undefined &&
      (obj.timestamp = Math.round(message.timestamp));
    message.uid !== undefined && (obj.uid = Math.round(message.uid));
    message.ack !== undefined &&
      (obj.ack = message.ack ? Ack.toJSON(message.ack) : undefined);
    message.config !== undefined &&
      (obj.config = message.config
        ? ConfigResponse.toJSON(message.config)
        : undefined);
    message.energy !== undefined &&
      (obj.energy = message.energy
        ? EnergyResponse.toJSON(message.energy)
        : undefined);
    message.time !== undefined &&
      (obj.time = message.time ? TimeResponse.toJSON(message.time) : undefined);
    message.status !== undefined &&
      (obj.status = message.status
        ? StatusResponse.toJSON(message.status)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Response>, I>>(object: I): Response {
    const message = createBaseResponse();
    message.timestamp = object.timestamp ?? 0;
    message.uid = object.uid ?? 0;
    message.ack =
      object.ack !== undefined && object.ack !== null
        ? Ack.fromPartial(object.ack)
        : undefined;
    message.config =
      object.config !== undefined && object.config !== null
        ? ConfigResponse.fromPartial(object.config)
        : undefined;
    message.energy =
      object.energy !== undefined && object.energy !== null
        ? EnergyResponse.fromPartial(object.energy)
        : undefined;
    message.time =
      object.time !== undefined && object.time !== null
        ? TimeResponse.fromPartial(object.time)
        : undefined;
    message.status =
      object.status !== undefined && object.status !== null
        ? StatusResponse.fromPartial(object.status)
        : undefined;
    return message;
  },
};

function createBaseAck(): Ack {
  return {};
}

export const Ack = {
  encode(_: Ack, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Ack {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAck();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): Ack {
    return {};
  },

  toJSON(_: Ack): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Ack>, I>>(_: I): Ack {
    const message = createBaseAck();
    return message;
  },
};

function createBaseConfigResponse(): ConfigResponse {
  return { content: undefined };
}

export const ConfigResponse = {
  encode(
    message: ConfigResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.content !== undefined) {
      ConfigContent.encode(message.content, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ConfigResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConfigResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.content = ConfigContent.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ConfigResponse {
    return {
      content: isSet(object.content)
        ? ConfigContent.fromJSON(object.content)
        : undefined,
    };
  },

  toJSON(message: ConfigResponse): unknown {
    const obj: any = {};
    message.content !== undefined &&
      (obj.content = message.content
        ? ConfigContent.toJSON(message.content)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ConfigResponse>, I>>(
    object: I
  ): ConfigResponse {
    const message = createBaseConfigResponse();
    message.content =
      object.content !== undefined && object.content !== null
        ? ConfigContent.fromPartial(object.content)
        : undefined;
    return message;
  },
};

function createBaseEnergyFrame(): EnergyFrame {
  return { endTimestamp: 0, averageVoltage: 0, averageCurrent: 0 };
}

export const EnergyFrame = {
  encode(
    message: EnergyFrame,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.endTimestamp !== 0) {
      writer.uint32(8).uint32(message.endTimestamp);
    }
    if (message.averageVoltage !== 0) {
      writer.uint32(16).int32(message.averageVoltage);
    }
    if (message.averageCurrent !== 0) {
      writer.uint32(24).int32(message.averageCurrent);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EnergyFrame {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEnergyFrame();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.endTimestamp = reader.uint32();
          break;
        case 2:
          message.averageVoltage = reader.int32();
          break;
        case 3:
          message.averageCurrent = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EnergyFrame {
    return {
      endTimestamp: isSet(object.endTimestamp)
        ? Number(object.endTimestamp)
        : 0,
      averageVoltage: isSet(object.averageVoltage)
        ? Number(object.averageVoltage)
        : 0,
      averageCurrent: isSet(object.averageCurrent)
        ? Number(object.averageCurrent)
        : 0,
    };
  },

  toJSON(message: EnergyFrame): unknown {
    const obj: any = {};
    message.endTimestamp !== undefined &&
      (obj.endTimestamp = Math.round(message.endTimestamp));
    message.averageVoltage !== undefined &&
      (obj.averageVoltage = Math.round(message.averageVoltage));
    message.averageCurrent !== undefined &&
      (obj.averageCurrent = Math.round(message.averageCurrent));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<EnergyFrame>, I>>(
    object: I
  ): EnergyFrame {
    const message = createBaseEnergyFrame();
    message.endTimestamp = object.endTimestamp ?? 0;
    message.averageVoltage = object.averageVoltage ?? 0;
    message.averageCurrent = object.averageCurrent ?? 0;
    return message;
  },
};

function createBaseEnergyResponse(): EnergyResponse {
  return { frames: [] };
}

export const EnergyResponse = {
  encode(
    message: EnergyResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.frames) {
      EnergyFrame.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EnergyResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEnergyResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.frames.push(EnergyFrame.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EnergyResponse {
    return {
      frames: Array.isArray(object?.frames)
        ? object.frames.map((e: any) => EnergyFrame.fromJSON(e))
        : [],
    };
  },

  toJSON(message: EnergyResponse): unknown {
    const obj: any = {};
    if (message.frames) {
      obj.frames = message.frames.map((e) =>
        e ? EnergyFrame.toJSON(e) : undefined
      );
    } else {
      obj.frames = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<EnergyResponse>, I>>(
    object: I
  ): EnergyResponse {
    const message = createBaseEnergyResponse();
    message.frames =
      object.frames?.map((e) => EnergyFrame.fromPartial(e)) || [];
    return message;
  },
};

function createBaseTimeResponse(): TimeResponse {
  return {};
}

export const TimeResponse = {
  encode(
    _: TimeResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TimeResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTimeResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): TimeResponse {
    return {};
  },

  toJSON(_: TimeResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TimeResponse>, I>>(
    _: I
  ): TimeResponse {
    const message = createBaseTimeResponse();
    return message;
  },
};

function createBaseStatusResponse(): StatusResponse {
  return { uptime: 0, flashUsage: 0, temperature: 0, voltage: 0, current: 0 };
}

export const StatusResponse = {
  encode(
    message: StatusResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.uptime !== 0) {
      writer.uint32(8).uint32(message.uptime);
    }
    if (message.flashUsage !== 0) {
      writer.uint32(16).uint32(message.flashUsage);
    }
    if (message.temperature !== 0) {
      writer.uint32(24).int32(message.temperature);
    }
    if (message.voltage !== 0) {
      writer.uint32(32).uint32(message.voltage);
    }
    if (message.current !== 0) {
      writer.uint32(40).uint32(message.current);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StatusResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStatusResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.uptime = reader.uint32();
          break;
        case 2:
          message.flashUsage = reader.uint32();
          break;
        case 3:
          message.temperature = reader.int32();
          break;
        case 4:
          message.voltage = reader.uint32();
          break;
        case 5:
          message.current = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StatusResponse {
    return {
      uptime: isSet(object.uptime) ? Number(object.uptime) : 0,
      flashUsage: isSet(object.flashUsage) ? Number(object.flashUsage) : 0,
      temperature: isSet(object.temperature) ? Number(object.temperature) : 0,
      voltage: isSet(object.voltage) ? Number(object.voltage) : 0,
      current: isSet(object.current) ? Number(object.current) : 0,
    };
  },

  toJSON(message: StatusResponse): unknown {
    const obj: any = {};
    message.uptime !== undefined && (obj.uptime = Math.round(message.uptime));
    message.flashUsage !== undefined &&
      (obj.flashUsage = Math.round(message.flashUsage));
    message.temperature !== undefined &&
      (obj.temperature = Math.round(message.temperature));
    message.voltage !== undefined &&
      (obj.voltage = Math.round(message.voltage));
    message.current !== undefined &&
      (obj.current = Math.round(message.current));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<StatusResponse>, I>>(
    object: I
  ): StatusResponse {
    const message = createBaseStatusResponse();
    message.uptime = object.uptime ?? 0;
    message.flashUsage = object.flashUsage ?? 0;
    message.temperature = object.temperature ?? 0;
    message.voltage = object.voltage ?? 0;
    message.current = object.current ?? 0;
    return message;
  },
};

function createBaseConfigContent(): ConfigContent {
  return { serialNumber: 0, teamNumber: 0, vehicleClass: undefined };
}

export const ConfigContent = {
  encode(
    message: ConfigContent,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.serialNumber !== 0) {
      writer.uint32(8).uint32(message.serialNumber);
    }
    if (message.teamNumber !== 0) {
      writer.uint32(16).uint32(message.teamNumber);
    }
    if (message.vehicleClass !== undefined) {
      writer.uint32(24).int32(message.vehicleClass);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ConfigContent {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConfigContent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.serialNumber = reader.uint32();
          break;
        case 2:
          message.teamNumber = reader.uint32();
          break;
        case 3:
          message.vehicleClass = reader.int32() as any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ConfigContent {
    return {
      serialNumber: isSet(object.serialNumber)
        ? Number(object.serialNumber)
        : 0,
      teamNumber: isSet(object.teamNumber) ? Number(object.teamNumber) : 0,
      vehicleClass: isSet(object.vehicleClass)
        ? vehicleClassFromJSON(object.vehicleClass)
        : undefined,
    };
  },

  toJSON(message: ConfigContent): unknown {
    const obj: any = {};
    message.serialNumber !== undefined &&
      (obj.serialNumber = Math.round(message.serialNumber));
    message.teamNumber !== undefined &&
      (obj.teamNumber = Math.round(message.teamNumber));
    message.vehicleClass !== undefined &&
      (obj.vehicleClass =
        message.vehicleClass !== undefined
          ? vehicleClassToJSON(message.vehicleClass)
          : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ConfigContent>, I>>(
    object: I
  ): ConfigContent {
    const message = createBaseConfigContent();
    message.serialNumber = object.serialNumber ?? 0;
    message.teamNumber = object.teamNumber ?? 0;
    message.vehicleClass = object.vehicleClass ?? undefined;
    return message;
  },
};

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & Record<
        Exclude<keyof I, KeysOfUnion<P>>,
        never
      >;

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
