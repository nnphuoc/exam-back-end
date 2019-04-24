'use strict';

export default class BaseModeClass {
    static async getAll(params) {
        params = Object.assign({
            where: null,
            limit: 100,
            page: 1,
            sort: { createdAt: -1 },
            select: null,
            populate: '',
            isLean: true
        }, params);
        if (params.limit > 100) {
            params.limit = 100;
        }   
        if (params.page !== undefined && params.page >= 1) {
            params.skip = params.limit * (params.page - 1);
        }
        const promise = await Promise.all([
            this.find({ ...params.where, deletedAt: null })
            .limit(params.limit)
            .skip(params.skip)
            .sort(params.sort)
            .select(params.select)
            .populate(params.populate)
            .lean(params.isLean),
            this.countDocuments({ ...params.where, deletedAt: null })
        ]);
        const [data, count] = promise;
        return {
            page: params.page ? params.page : 1,
            limit: params.limit ? params.limit : 100,
            count,
            data
        };        
    }

    static async getOne(params) {
        params = Object.assign(
            {
                where: null,
                select: null,
                populate: '',
                isLean: true,
                isUpdateCountView: false
            },
            params
        );
        if (params.isUpdateCountView) {
            await this.updateOne(params.where, { $inc: { countView: 1 } });
        }
        return await this.findOne({...params.where, deletedAt: null })
            .populate(params.populate)
            .select(params.select)
            .lean(params.isLean);
    }

    static async softDelete(data) {
        return await this.updateOne(data.where, {
            $set: { deletedAt: new Date() }
        });
    }

    static async createOrUpdate(data) {
        const result = await this.findOne(data.where);
        if (!result) {
            return this.create(data.create ? data.create : data.where);
        } else {
            return this.updateOne(data.where, data.update);
        }
    }
}