import mongoose, { ObjectId } from 'mongoose';
import { DomainStatus } from '../types/domain';

export interface DomainAttrs {
  domainName: string;
  status: DomainStatus;
  scanDate: Date;
  data: {
    [key: string]: any;
  };
}

interface DomainModel extends mongoose.Model<DomainDoc> {
  build(attrs: DomainAttrs): DomainDoc;
}

export interface DomainDoc extends mongoose.Document {
  id: ObjectId;
  domainName: string;
  status: string;
  scanDate: Date;
  data: {
    [key: string]: any;
  };
}

const schema = {
  domainName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(DomainStatus),
    required: true,
  },
  scanDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  data: {
    type: Object,
    required: true,
    default: {},
  },
};

const options = {
  toJSON: {
    transform(doc: any, ret: any) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
};

const DomainSchema = new mongoose.Schema(schema, options);
const HistorySchema = new mongoose.Schema(schema, options);

DomainSchema.index({ scanDate: 1 });
DomainSchema.index({ status: 1 });
DomainSchema.statics.build = (attrs: DomainAttrs) => {
  return new Domain(attrs);
};

HistorySchema.statics.build = (attrs: DomainAttrs) => {
  return new History(attrs);
};

const Domain = mongoose.model<DomainDoc, DomainModel>('Domain', DomainSchema);
const History = mongoose.model<DomainAttrs, DomainModel>(
  'History',
  HistorySchema
);

export { Domain, History };
