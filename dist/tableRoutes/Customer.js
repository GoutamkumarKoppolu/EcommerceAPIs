"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteACustomer = exports.updateACustomer = exports.insertIntoCustomer = exports.getOneCustomer = exports.getCustomer = void 0;
const connection_1 = require("../connection/connection");
const getCustomer = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let offset = request.query.offset;
    let next = request.query.next;
    let fieldname = request.query.fieldname;
    let columnname = request.query.columnname;
    if (offset && next) {
        let a = yield (yield connection_1.connect).query(`SELECT * FROM [ecommerceDb1].[dbo].[Customer] ORDER BY Id OFFSET ${offset} ROWS FETCH NEXT ${next} ROWS ONLY`);
        return response.status(200).json({ message: "fetched requested data successfully", response: a });
    }
    else if (fieldname && columnname) {
        let filteredData = yield (yield connection_1.connect).query(`SELECT * FROM [ecommerceDb1].[dbo].[Customer] WHERE [${columnname}] LIKE '%${fieldname}%'`);
        console.log(filteredData);
        return response.status(200).json({ message: "fetched requested data successfully", response: filteredData });
    }
    else if ((fieldname && !columnname) || (!fieldname && columnname)) {
        return response.status(404).json({ message: "you have provided incorrect details, please verify from your end." });
    }
    else if (!offset && !next) {
        let a = yield (yield connection_1.connect).query(`SELECT * FROM [ecommerceDb1].[dbo].[Customer]`);
        return response.status(200).json({ message: "fetched requested data successfully", response: a });
    }
    else if (!offset || !next) {
        return response.status(404).json({ message: "you might have provided only one value instead of two. Please provide offset as well as next values" });
    }
    else {
        return response.status(404).json({ message: "please choose between the respected values" });
    }
});
exports.getCustomer = getCustomer;
const getOneCustomer = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let id = request.params.id;
    let a = yield (yield connection_1.connect).query(`select * from [ecommerceDb1].[dbo].[Customer] where Id =${id}`);
    if (a[0]) {
        return response.status(200).json({ message: "Required details have been fetched successfully", response: a });
    }
    else {
        return response.status(404).json({ message: "Invalid ID number, Please search with a valid ID number" });
    }
});
exports.getOneCustomer = getOneCustomer;
const insertIntoCustomer = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const newCustomer = {
        FirstName: request.body.firstname,
        LastName: request.body.lastname,
        City: request.body.city,
        Country: request.body.country,
        Phone: request.body.phone,
    };
    if (newCustomer.FirstName && newCustomer.LastName) {
        let a = yield (yield connection_1.connect).query(`insert into [ecommerceDb1].[dbo].[Customer] ([FirstName], 
        [LastName], [City], [Country], [Phone]) values('${newCustomer.FirstName}','${newCustomer.LastName}',
        '${newCustomer.City}', '${newCustomer.Country}','${newCustomer.Phone}')`);
        let newCust = yield (yield connection_1.connect).query(`select *  from [ecommerceDb1].[dbo].[Customer] where FirstName='${newCustomer.FirstName}' and LastName = '${newCustomer.LastName}'  
    and City='${newCustomer.City}' and Country ='${newCustomer.Country}' and Phone='${newCustomer.Phone}'`);
        return response.status(200).json({ message: "Required details has been inserted successfully", response: newCust });
    }
    else if (!newCustomer.FirstName) {
        return response.status(404).json({ message: " you have forgot to send first name, please send the first name" });
    }
    else {
        return response.status(404).json({ message: " you have forgot to send last name please send the last name" });
    }
});
exports.insertIntoCustomer = insertIntoCustomer;
const updateACustomer = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let id = request.params.id;
    let result_id = yield (yield connection_1.connect).query(`select * from [ecommerceDb1].[dbo].[Customer] where Id=${id}`);
    if (!result_id[0]) {
        return response.status(404).json({ message: "please enter a valid id number" });
    }
    else {
        let FirstName = request.body.FirstName ? request.body.FirstName : result_id[0].FirstName;
        let LastName = request.body.LastName ? request.body.LastName : result_id[0].LastName;
        let City = request.body.City ? request.body.City : result_id[0].City;
        let Country = request.body.Country ? request.body.Country : result_id[0].Country;
        let Phone = request.body.Phone ? request.body.Phone : result_id[0].Phone;
        let result = yield (yield connection_1.connect).query(`UPDATE [ecommerceDb1].[dbo].[Customer] 
        SET FirstName='${FirstName}',LastName='${LastName}',City='${City}',Country='${Country}',Phone='${Phone}' WHERE id = ${id};`);
        let updated_row = yield (yield connection_1.connect).query(`select top (1) * from [ecommerceDb1].[dbo].[Customer] where Id=${id}`);
        return response.status(200).json({ message: "successfully updated", response: updated_row });
    }
});
exports.updateACustomer = updateACustomer;
const deleteACustomer = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let id = request.params.id;
    let result = yield (yield connection_1.connect).query(`select * from [ecommerceDb1].[dbo].[Customer] where Id=${id}`);
    if (result[0]) {
        let deletedColumn = yield (yield connection_1.connect).query(`DELETE FROM [ecommerceDb1].[dbo].[Customer] WHERE Id = ${id}`);
        return response.status(200).json({ message: 'post deleted successfully', response: deletedColumn });
    }
    else {
        return response.status(404).json({ message: " Please enter a valid id number " });
    }
});
exports.deleteACustomer = deleteACustomer;
//# sourceMappingURL=Customer.js.map