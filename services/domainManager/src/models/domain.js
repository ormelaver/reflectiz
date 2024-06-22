"use strict";
exports.__esModule = true;
exports.Domain = void 0;
var mongoose_1 = require("mongoose");
var DomainSchema = new mongoose_1["default"].Schema({
    domainName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    lastScannedAt: {
        type: Date,
        required: true,
        "default": Date.now
    },
    data: {
        type: Object,
        required: true
    }
}, {
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});
DomainSchema.index({ lastScannedAt: 1 });
DomainSchema.index({ status: 1 });
DomainSchema.statics.build = function (attrs) {
    return new Domain(attrs);
};
var Domain = mongoose_1["default"].model('Domain', DomainSchema);
exports.Domain = Domain;
