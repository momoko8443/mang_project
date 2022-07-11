const User = require('../models/Schema').User;
const BaseDAO = require('./BaseDAO');

class UserDAO extends BaseDAO{
    constructor(){
        super(User);
    }
    async findOrCreate(userDto, transaction) {
        
        const objResult = await User.findOrCreate({where:{email:userDto.email},defaults:userDto,transaction:transaction});
        return objResult;
    }
}

module.exports = new UserDAO();