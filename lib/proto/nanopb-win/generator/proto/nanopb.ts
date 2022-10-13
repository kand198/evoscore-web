/* eslint-disable */
import { FieldDescriptorProto_Type, fieldDescriptorProto_TypeFromJSON, fieldDescriptorProto_TypeToJSON } from '../../../../google/protobuf/descriptor';
import * as _m0 from 'protobufjs/minimal';

export const protobufPackage = '';

export enum FieldType {
  /** FT_DEFAULT - Automatically decide field type, generate static field if possible. */
  FT_DEFAULT = 0,
  /** FT_CALLBACK - Always generate a callback field. */
  FT_CALLBACK = 1,
  /** FT_POINTER - Always generate a dynamically allocated field. */
  FT_POINTER = 4,
  /** FT_STATIC - Generate a static field or raise an exception if not possible. */
  FT_STATIC = 2,
  /** FT_IGNORE - Ignore the field completely. */
  FT_IGNORE = 3,
  /** FT_INLINE - Legacy option, use the separate 'fixed_length' option instead */
  FT_INLINE = 5,
  UNRECOGNIZED = -1,
}

export function fieldTypeFromJSON(object: any): FieldType {
  switch (object) {
    case 0:
    case 'FT_DEFAULT':
      return FieldType.FT_DEFAULT;
    case 1:
    case 'FT_CALLBACK':
      return FieldType.FT_CALLBACK;
    case 4:
    case 'FT_POINTER':
      return FieldType.FT_POINTER;
    case 2:
    case 'FT_STATIC':
      return FieldType.FT_STATIC;
    case 3:
    case 'FT_IGNORE':
      return FieldType.FT_IGNORE;
    case 5:
    case 'FT_INLINE':
      return FieldType.FT_INLINE;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return FieldType.UNRECOGNIZED;
  }
}

export function fieldTypeToJSON(object: FieldType): string {
  switch (object) {
    case FieldType.FT_DEFAULT:
      return 'FT_DEFAULT';
    case FieldType.FT_CALLBACK:
      return 'FT_CALLBACK';
    case FieldType.FT_POINTER:
      return 'FT_POINTER';
    case FieldType.FT_STATIC:
      return 'FT_STATIC';
    case FieldType.FT_IGNORE:
      return 'FT_IGNORE';
    case FieldType.FT_INLINE:
      return 'FT_INLINE';
    case FieldType.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED';
  }
}

export enum IntSize {
  /** IS_DEFAULT - Default, 32/64bit based on type in .proto */
  IS_DEFAULT = 0,
  IS_8 = 8,
  IS_16 = 16,
  IS_32 = 32,
  IS_64 = 64,
  UNRECOGNIZED = -1,
}

export function intSizeFromJSON(object: any): IntSize {
  switch (object) {
    case 0:
    case 'IS_DEFAULT':
      return IntSize.IS_DEFAULT;
    case 8:
    case 'IS_8':
      return IntSize.IS_8;
    case 16:
    case 'IS_16':
      return IntSize.IS_16;
    case 32:
    case 'IS_32':
      return IntSize.IS_32;
    case 64:
    case 'IS_64':
      return IntSize.IS_64;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return IntSize.UNRECOGNIZED;
  }
}

export function intSizeToJSON(object: IntSize): string {
  switch (object) {
    case IntSize.IS_DEFAULT:
      return 'IS_DEFAULT';
    case IntSize.IS_8:
      return 'IS_8';
    case IntSize.IS_16:
      return 'IS_16';
    case IntSize.IS_32:
      return 'IS_32';
    case IntSize.IS_64:
      return 'IS_64';
    case IntSize.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED';
  }
}

export enum TypenameMangling {
  /** M_NONE - Default, no typename mangling */
  M_NONE = 0,
  /** M_STRIP_PACKAGE - Strip current package name */
  M_STRIP_PACKAGE = 1,
  /** M_FLATTEN - Only use last path component */
  M_FLATTEN = 2,
  /** M_PACKAGE_INITIALS - Replace the package name by the initials */
  M_PACKAGE_INITIALS = 3,
  UNRECOGNIZED = -1,
}

export function typenameManglingFromJSON(object: any): TypenameMangling {
  switch (object) {
    case 0:
    case 'M_NONE':
      return TypenameMangling.M_NONE;
    case 1:
    case 'M_STRIP_PACKAGE':
      return TypenameMangling.M_STRIP_PACKAGE;
    case 2:
    case 'M_FLATTEN':
      return TypenameMangling.M_FLATTEN;
    case 3:
    case 'M_PACKAGE_INITIALS':
      return TypenameMangling.M_PACKAGE_INITIALS;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return TypenameMangling.UNRECOGNIZED;
  }
}

export function typenameManglingToJSON(object: TypenameMangling): string {
  switch (object) {
    case TypenameMangling.M_NONE:
      return 'M_NONE';
    case TypenameMangling.M_STRIP_PACKAGE:
      return 'M_STRIP_PACKAGE';
    case TypenameMangling.M_FLATTEN:
      return 'M_FLATTEN';
    case TypenameMangling.M_PACKAGE_INITIALS:
      return 'M_PACKAGE_INITIALS';
    case TypenameMangling.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED';
  }
}

export enum DescriptorSize {
  /** DS_AUTO - Select minimal size based on field type */
  DS_AUTO = 0,
  /** DS_1 - 1 word; up to 15 byte fields, no arrays */
  DS_1 = 1,
  /** DS_2 - 2 words; up to 4095 byte fields, 4095 entry arrays */
  DS_2 = 2,
  /** DS_4 - 4 words; up to 2^32-1 byte fields, 2^16-1 entry arrays */
  DS_4 = 4,
  /** DS_8 - 8 words; up to 2^32-1 entry arrays */
  DS_8 = 8,
  UNRECOGNIZED = -1,
}

export function descriptorSizeFromJSON(object: any): DescriptorSize {
  switch (object) {
    case 0:
    case 'DS_AUTO':
      return DescriptorSize.DS_AUTO;
    case 1:
    case 'DS_1':
      return DescriptorSize.DS_1;
    case 2:
    case 'DS_2':
      return DescriptorSize.DS_2;
    case 4:
    case 'DS_4':
      return DescriptorSize.DS_4;
    case 8:
    case 'DS_8':
      return DescriptorSize.DS_8;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return DescriptorSize.UNRECOGNIZED;
  }
}

export function descriptorSizeToJSON(object: DescriptorSize): string {
  switch (object) {
    case DescriptorSize.DS_AUTO:
      return 'DS_AUTO';
    case DescriptorSize.DS_1:
      return 'DS_1';
    case DescriptorSize.DS_2:
      return 'DS_2';
    case DescriptorSize.DS_4:
      return 'DS_4';
    case DescriptorSize.DS_8:
      return 'DS_8';
    case DescriptorSize.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED';
  }
}

/**
 * This is the inner options message, which basically defines options for
 * a field. When it is used in message or file scope, it applies to all
 * fields.
 */
export interface NanoPBOptions {
  /**
   * Allocated size for 'bytes' and 'string' fields.
   * For string fields, this should include the space for null terminator.
   */
  maxSize: number;
  /**
   * Maximum length for 'string' fields. Setting this is equivalent
   * to setting max_size to a value of length+1.
   */
  maxLength: number;
  /** Allocated number of entries in arrays ('repeated' fields) */
  maxCount: number;
  /**
   * Size of integer fields. Can save some memory if you don't need
   * full 32 bits for the value.
   */
  intSize: IntSize;
  /** Force type of field (callback or static allocation) */
  type: FieldType;
  /** Use long names for enums, i.e. EnumName_EnumValue. */
  longNames: boolean;
  /**
   * Add 'packed' attribute to generated structs.
   * Note: this cannot be used on CPUs that break on unaligned
   * accesses to variables.
   */
  packedStruct: boolean;
  /** Add 'packed' attribute to generated enums. */
  packedEnum: boolean;
  /** Skip this message */
  skipMessage: boolean;
  /** Generate oneof fields as normal optional fields instead of union. */
  noUnions: boolean;
  /** integer type tag for a message */
  msgid: number;
  /** decode oneof as anonymous union */
  anonymousOneof: boolean;
  /** Proto3 singular field does not generate a "has_" flag */
  proto3: boolean;
  /**
   * Force proto3 messages to have no "has_" flag.
   * This was default behavior until nanopb-0.4.0.
   */
  proto3SingularMsgs: boolean;
  /** Generate an enum->string mapping function (can take up lots of space). */
  enumToString: boolean;
  /** Generate bytes arrays with fixed length */
  fixedLength: boolean;
  /** Generate repeated field with fixed count */
  fixedCount: boolean;
  /**
   * Generate message-level callback that is called before decoding submessages.
   * This can be used to set callback fields for submsgs inside oneofs.
   */
  submsgCallback: boolean;
  /**
   * Shorten or remove package names from type names.
   * This option applies only on the file level.
   */
  mangleNames: TypenameMangling;
  /** Data type for storage associated with callback fields. */
  callbackDatatype: string;
  /**
   * Callback function used for encoding and decoding.
   * Prior to nanopb-0.4.0, the callback was specified in per-field pb_callback_t
   * structure. This is still supported, but does not work inside e.g. oneof or pointer
   * fields. Instead, a new method allows specifying a per-message callback that
   * will be called for all callback fields in a message type.
   */
  callbackFunction: string;
  /**
   * Select the size of field descriptors. This option has to be defined
   * for the whole message, not per-field. Usually automatic selection is
   * ok, but if it results in compilation errors you can increase the field
   * size here.
   */
  descriptorsize: DescriptorSize;
  /** Set default value for has_ fields. */
  defaultHas: boolean;
  /** Extra files to include in generated `.pb.h` */
  include: string[];
  /**
   * Automatic includes to exlude from generated `.pb.h`
   * Same as nanopb_generator.py command line flag -x.
   */
  exclude: string[];
  /** Package name that applies only for nanopb. */
  package: string;
  /** Override type of the field in generated C code. Only to be used with related field types */
  typeOverride: FieldDescriptorProto_Type;
  /**
   * Due to historical reasons, nanopb orders fields in structs by their tag number
   * instead of the order in .proto. Set this to false to keep the .proto order.
   * The default value will probably change to false in nanopb-0.5.0.
   */
  sortByTag: boolean;
}

function createBaseNanoPBOptions(): NanoPBOptions {
  return {
    maxSize: 0,
    maxLength: 0,
    maxCount: 0,
    intSize: 0,
    type: 0,
    longNames: false,
    packedStruct: false,
    packedEnum: false,
    skipMessage: false,
    noUnions: false,
    msgid: 0,
    anonymousOneof: false,
    proto3: false,
    proto3SingularMsgs: false,
    enumToString: false,
    fixedLength: false,
    fixedCount: false,
    submsgCallback: false,
    mangleNames: 0,
    callbackDatatype: '',
    callbackFunction: '',
    descriptorsize: 0,
    defaultHas: false,
    include: [],
    exclude: [],
    package: '',
    typeOverride: 1,
    sortByTag: false,
  };
}

export const NanoPBOptions = {
  encode(message: NanoPBOptions, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.maxSize !== 0) {
      writer.uint32(8).int32(message.maxSize);
    }
    if (message.maxLength !== 0) {
      writer.uint32(112).int32(message.maxLength);
    }
    if (message.maxCount !== 0) {
      writer.uint32(16).int32(message.maxCount);
    }
    if (message.intSize !== 0) {
      writer.uint32(56).int32(message.intSize);
    }
    if (message.type !== 0) {
      writer.uint32(24).int32(message.type);
    }
    if (message.longNames === true) {
      writer.uint32(32).bool(message.longNames);
    }
    if (message.packedStruct === true) {
      writer.uint32(40).bool(message.packedStruct);
    }
    if (message.packedEnum === true) {
      writer.uint32(80).bool(message.packedEnum);
    }
    if (message.skipMessage === true) {
      writer.uint32(48).bool(message.skipMessage);
    }
    if (message.noUnions === true) {
      writer.uint32(64).bool(message.noUnions);
    }
    if (message.msgid !== 0) {
      writer.uint32(72).uint32(message.msgid);
    }
    if (message.anonymousOneof === true) {
      writer.uint32(88).bool(message.anonymousOneof);
    }
    if (message.proto3 === true) {
      writer.uint32(96).bool(message.proto3);
    }
    if (message.proto3SingularMsgs === true) {
      writer.uint32(168).bool(message.proto3SingularMsgs);
    }
    if (message.enumToString === true) {
      writer.uint32(104).bool(message.enumToString);
    }
    if (message.fixedLength === true) {
      writer.uint32(120).bool(message.fixedLength);
    }
    if (message.fixedCount === true) {
      writer.uint32(128).bool(message.fixedCount);
    }
    if (message.submsgCallback === true) {
      writer.uint32(176).bool(message.submsgCallback);
    }
    if (message.mangleNames !== 0) {
      writer.uint32(136).int32(message.mangleNames);
    }
    if (message.callbackDatatype !== '') {
      writer.uint32(146).string(message.callbackDatatype);
    }
    if (message.callbackFunction !== '') {
      writer.uint32(154).string(message.callbackFunction);
    }
    if (message.descriptorsize !== 0) {
      writer.uint32(160).int32(message.descriptorsize);
    }
    if (message.defaultHas === true) {
      writer.uint32(184).bool(message.defaultHas);
    }
    for (const v of message.include) {
      writer.uint32(194).string(v!);
    }
    for (const v of message.exclude) {
      writer.uint32(210).string(v!);
    }
    if (message.package !== '') {
      writer.uint32(202).string(message.package);
    }
    if (message.typeOverride !== 1) {
      writer.uint32(216).int32(message.typeOverride);
    }
    if (message.sortByTag === true) {
      writer.uint32(224).bool(message.sortByTag);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NanoPBOptions {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNanoPBOptions();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.maxSize = reader.int32();
          break;
        case 14:
          message.maxLength = reader.int32();
          break;
        case 2:
          message.maxCount = reader.int32();
          break;
        case 7:
          message.intSize = reader.int32() as any;
          break;
        case 3:
          message.type = reader.int32() as any;
          break;
        case 4:
          message.longNames = reader.bool();
          break;
        case 5:
          message.packedStruct = reader.bool();
          break;
        case 10:
          message.packedEnum = reader.bool();
          break;
        case 6:
          message.skipMessage = reader.bool();
          break;
        case 8:
          message.noUnions = reader.bool();
          break;
        case 9:
          message.msgid = reader.uint32();
          break;
        case 11:
          message.anonymousOneof = reader.bool();
          break;
        case 12:
          message.proto3 = reader.bool();
          break;
        case 21:
          message.proto3SingularMsgs = reader.bool();
          break;
        case 13:
          message.enumToString = reader.bool();
          break;
        case 15:
          message.fixedLength = reader.bool();
          break;
        case 16:
          message.fixedCount = reader.bool();
          break;
        case 22:
          message.submsgCallback = reader.bool();
          break;
        case 17:
          message.mangleNames = reader.int32() as any;
          break;
        case 18:
          message.callbackDatatype = reader.string();
          break;
        case 19:
          message.callbackFunction = reader.string();
          break;
        case 20:
          message.descriptorsize = reader.int32() as any;
          break;
        case 23:
          message.defaultHas = reader.bool();
          break;
        case 24:
          message.include.push(reader.string());
          break;
        case 26:
          message.exclude.push(reader.string());
          break;
        case 25:
          message.package = reader.string();
          break;
        case 27:
          message.typeOverride = reader.int32() as any;
          break;
        case 28:
          message.sortByTag = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): NanoPBOptions {
    return {
      maxSize: isSet(object.maxSize) ? Number(object.maxSize) : 0,
      maxLength: isSet(object.maxLength) ? Number(object.maxLength) : 0,
      maxCount: isSet(object.maxCount) ? Number(object.maxCount) : 0,
      intSize: isSet(object.intSize) ? intSizeFromJSON(object.intSize) : 0,
      type: isSet(object.type) ? fieldTypeFromJSON(object.type) : 0,
      longNames: isSet(object.longNames) ? Boolean(object.longNames) : false,
      packedStruct: isSet(object.packedStruct) ? Boolean(object.packedStruct) : false,
      packedEnum: isSet(object.packedEnum) ? Boolean(object.packedEnum) : false,
      skipMessage: isSet(object.skipMessage) ? Boolean(object.skipMessage) : false,
      noUnions: isSet(object.noUnions) ? Boolean(object.noUnions) : false,
      msgid: isSet(object.msgid) ? Number(object.msgid) : 0,
      anonymousOneof: isSet(object.anonymousOneof) ? Boolean(object.anonymousOneof) : false,
      proto3: isSet(object.proto3) ? Boolean(object.proto3) : false,
      proto3SingularMsgs: isSet(object.proto3SingularMsgs) ? Boolean(object.proto3SingularMsgs) : false,
      enumToString: isSet(object.enumToString) ? Boolean(object.enumToString) : false,
      fixedLength: isSet(object.fixedLength) ? Boolean(object.fixedLength) : false,
      fixedCount: isSet(object.fixedCount) ? Boolean(object.fixedCount) : false,
      submsgCallback: isSet(object.submsgCallback) ? Boolean(object.submsgCallback) : false,
      mangleNames: isSet(object.mangleNames) ? typenameManglingFromJSON(object.mangleNames) : 0,
      callbackDatatype: isSet(object.callbackDatatype) ? String(object.callbackDatatype) : '',
      callbackFunction: isSet(object.callbackFunction) ? String(object.callbackFunction) : '',
      descriptorsize: isSet(object.descriptorsize) ? descriptorSizeFromJSON(object.descriptorsize) : 0,
      defaultHas: isSet(object.defaultHas) ? Boolean(object.defaultHas) : false,
      include: Array.isArray(object?.include) ? object.include.map((e: any) => String(e)) : [],
      exclude: Array.isArray(object?.exclude) ? object.exclude.map((e: any) => String(e)) : [],
      package: isSet(object.package) ? String(object.package) : '',
      typeOverride: isSet(object.typeOverride) ? fieldDescriptorProto_TypeFromJSON(object.typeOverride) : 1,
      sortByTag: isSet(object.sortByTag) ? Boolean(object.sortByTag) : false,
    };
  },

  toJSON(message: NanoPBOptions): unknown {
    const obj: any = {};
    message.maxSize !== undefined && (obj.maxSize = Math.round(message.maxSize));
    message.maxLength !== undefined && (obj.maxLength = Math.round(message.maxLength));
    message.maxCount !== undefined && (obj.maxCount = Math.round(message.maxCount));
    message.intSize !== undefined && (obj.intSize = intSizeToJSON(message.intSize));
    message.type !== undefined && (obj.type = fieldTypeToJSON(message.type));
    message.longNames !== undefined && (obj.longNames = message.longNames);
    message.packedStruct !== undefined && (obj.packedStruct = message.packedStruct);
    message.packedEnum !== undefined && (obj.packedEnum = message.packedEnum);
    message.skipMessage !== undefined && (obj.skipMessage = message.skipMessage);
    message.noUnions !== undefined && (obj.noUnions = message.noUnions);
    message.msgid !== undefined && (obj.msgid = Math.round(message.msgid));
    message.anonymousOneof !== undefined && (obj.anonymousOneof = message.anonymousOneof);
    message.proto3 !== undefined && (obj.proto3 = message.proto3);
    message.proto3SingularMsgs !== undefined && (obj.proto3SingularMsgs = message.proto3SingularMsgs);
    message.enumToString !== undefined && (obj.enumToString = message.enumToString);
    message.fixedLength !== undefined && (obj.fixedLength = message.fixedLength);
    message.fixedCount !== undefined && (obj.fixedCount = message.fixedCount);
    message.submsgCallback !== undefined && (obj.submsgCallback = message.submsgCallback);
    message.mangleNames !== undefined && (obj.mangleNames = typenameManglingToJSON(message.mangleNames));
    message.callbackDatatype !== undefined && (obj.callbackDatatype = message.callbackDatatype);
    message.callbackFunction !== undefined && (obj.callbackFunction = message.callbackFunction);
    message.descriptorsize !== undefined && (obj.descriptorsize = descriptorSizeToJSON(message.descriptorsize));
    message.defaultHas !== undefined && (obj.defaultHas = message.defaultHas);
    if (message.include) {
      obj.include = message.include.map((e) => e);
    } else {
      obj.include = [];
    }
    if (message.exclude) {
      obj.exclude = message.exclude.map((e) => e);
    } else {
      obj.exclude = [];
    }
    message.package !== undefined && (obj.package = message.package);
    message.typeOverride !== undefined && (obj.typeOverride = fieldDescriptorProto_TypeToJSON(message.typeOverride));
    message.sortByTag !== undefined && (obj.sortByTag = message.sortByTag);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<NanoPBOptions>, I>>(object: I): NanoPBOptions {
    const message = createBaseNanoPBOptions();
    message.maxSize = object.maxSize ?? 0;
    message.maxLength = object.maxLength ?? 0;
    message.maxCount = object.maxCount ?? 0;
    message.intSize = object.intSize ?? 0;
    message.type = object.type ?? 0;
    message.longNames = object.longNames ?? false;
    message.packedStruct = object.packedStruct ?? false;
    message.packedEnum = object.packedEnum ?? false;
    message.skipMessage = object.skipMessage ?? false;
    message.noUnions = object.noUnions ?? false;
    message.msgid = object.msgid ?? 0;
    message.anonymousOneof = object.anonymousOneof ?? false;
    message.proto3 = object.proto3 ?? false;
    message.proto3SingularMsgs = object.proto3SingularMsgs ?? false;
    message.enumToString = object.enumToString ?? false;
    message.fixedLength = object.fixedLength ?? false;
    message.fixedCount = object.fixedCount ?? false;
    message.submsgCallback = object.submsgCallback ?? false;
    message.mangleNames = object.mangleNames ?? 0;
    message.callbackDatatype = object.callbackDatatype ?? '';
    message.callbackFunction = object.callbackFunction ?? '';
    message.descriptorsize = object.descriptorsize ?? 0;
    message.defaultHas = object.defaultHas ?? false;
    message.include = object.include?.map((e) => e) || [];
    message.exclude = object.exclude?.map((e) => e) || [];
    message.package = object.package ?? '';
    message.typeOverride = object.typeOverride ?? 1;
    message.sortByTag = object.sortByTag ?? false;
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

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
export type Exact<P, I extends P> = P extends Builtin ? P : P & { [K in keyof P]: Exact<P[K], I[K]> } & Record<Exclude<keyof I, KeysOfUnion<P>>, never>;

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
