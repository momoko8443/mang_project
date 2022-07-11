const sequelize = require('./connect');
const fs = require('fs');
const {QueryTypes} = require("sequelize");

async function dbPreCheck(){
    try{
        await sequelize.sync({force:false,alter:true});
        return true;
       
    }catch(err){
        console.error(err);
    }
}

async function initAdmin(){
    try{
        const sqlScripts = fs.readFileSync(__dirname+'/scripts/init.sql','utf-8')
        return await sequelize.query(sqlScripts, { type: QueryTypes.INSERT });
    }catch(err){
        console.error(err);
    }   
}

module.exports = dbPreCheck;

