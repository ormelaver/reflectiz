import mongoose, { ObjectId } from 'mongoose';

// an interface that describes the properties required to create a new Domain
export interface DomainAttrs {
  domainName: string;
  status: 'pending' | 'completed' | 'scanning';
  scanDate: Date;
  data: {
    [key: string]: any;
  };
}

// an interface that describes the properties that a Domain Model has
interface DomainModel extends mongoose.Model<DomainDoc> {
  build(attrs: DomainAttrs): DomainDoc;
}

// an interface that describes the properties that a Domain Document has
export interface DomainDoc extends mongoose.Document {
  id: ObjectId;
  domainName: string;
  status: string;
  scanDate: Date;
  data: {
    [key: string]: any;
  };
}
const DomainSchema = new mongoose.Schema(
  {
    domainName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
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
  },
  {
    toJSON: {
      transform(doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

DomainSchema.index({ scanDate: 1 });
DomainSchema.index({ status: 1 });
DomainSchema.statics.build = (attrs: DomainAttrs) => {
  return new Domain(attrs);
};

const Domain = mongoose.model<DomainDoc, DomainModel>('Domain', DomainSchema);
const History = mongoose.model<DomainDoc, DomainModel>('History', DomainSchema);

export { Domain, History };
