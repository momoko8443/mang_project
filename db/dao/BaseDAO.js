class BaseDAO {
    constructor(_Model) {
        this.Model = _Model;
    }
    async create(modelObject, transaction) {
        let createdModel;
        try {
            createdModel = await this.Model.create(modelObject, transaction)
        } catch (e) {
            console.error(e);
            throw e;
        }
        return createdModel;
    }

    async bulkCreate(modelObjectList, transaction) {
        let objResult;
        try {
            objResult = await this.Model.bulkCreate(modelObjectList, transaction);
            //throw new Error('transaction test');
        } catch (e) {
            console.error(e);
            throw e;
        }
        return objResult;
    }

    async update(id, newModelObject, transaction) {
        let exists = await this.Model.findByPk(id);
        delete newModelObject['id'];
        let existsModel = Object.assign(exists, newModelObject);
        let updatedModel = await existsModel.save(transaction);
        return updatedModel;
    }

    async patchUpdate(id, patchModelObject, transaction) {
        let exists = await this.Model.findByPk(id);
        Object.keys(patchModelObject).map((key) => {
            exists.set(key, patchModelObject[key]);
        })
        let result = await exists.save(transaction);
        return result;
    }

    async remove(id, transaction) {
        let existsModel = await this.Model.findByPk(id);
        let result;
        if (existsModel) {
            result = await existsModel.destroy(transaction);
        }

        return result;
    }
    
    async batchRemove(condition,transaction){
        const objResult = await this.Model.destroy({
            where:condition,
            transaction:transaction
        });
        return objResult;
    }

    async query(condition, includeAssociation) {
        let result = await this.Model.findOne({
            where: condition,
            include: includeAssociation
        }, )
        return result;
    }
    async queryAll(condition, sorter, offset, limit, attributes) {
        let result = await this.Model.findAll({
            where: condition,
            order: sorter,
            limit: limit,
            offset: offset,
            attributes: attributes
        })
        return result;
    }
}

module.exports = BaseDAO;