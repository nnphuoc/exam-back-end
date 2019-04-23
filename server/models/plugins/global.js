'use strict';
function findMiddleware(next) {
    const filter = this.getQuery();
    if (filter.deletedAt === undefined) {
        filter.deletedAt = null;
    }
    next();
}

function deleteTimestamps(next) {
    delete this.createdAt;
    delete this.updatedAt;
    next();
}

export default function(schema, options) {
    schema.pre('find', findMiddleware);
    schema.pre('findOne', findMiddleware);
    schema.pre('count', findMiddleware);
    schema.pre('save', deleteTimestamps);
    schema.pre('update', deleteTimestamps);
    schema.pre('updateOne', deleteTimestamps);
}
