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
exports.deleteASupplier = exports.updateAsupplier = exports.insertIntoSupplier = exports.getOneSupplier = exports.getSupplier = void 0;
const connection_1 = require("../connection/connection");
const getSupplier = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let offset = request.query.offset;
    let next = request.query.next;
    let fieldname = request.query.fieldname;
    let columnname = request.query.columnname;
    if (offset && next) {
        let a = yield (yield connection_1.connect).query(`SELECT * FROM [ecommerceDb1].[dbo].[Supplier] ORDER BY Id OFFSET ${offset} ROWS FETCH NEXT ${next} ROWS ONLY`);
        return response.status(200).json({ message: "fetched requested data successfully", response: a });
    }
    else if (fieldname && columnname) {
        let filteredData = yield (yield connection_1.connect).query(`SELECT * FROM [ecommerceDb1].[dbo].[Supplier] WHERE [${columnname}] LIKE '%${fieldname}%'`);
        console.log(filteredData);
        return response.status(200).json({ message: "fetched requested data successfully", response: filteredData });
    }
    else if ((fieldname && !columnname) || (!fieldname && columnname)) {
        return response.status(404).json({ message: "you have provided either one of column name or fieldname please refiry and provide the details." });
    }
    else if (!offset && !next) {
        let a = yield (yield connection_1.connect).query(`SELECT * FROM [ecommerceDb1].[dbo].[Supplier]`);
        return response.status(200).json({ message: "fetched requested data successfully", response: a });
    }
    else if (!offset || !next) {
        return response.status(404).json({ message: " you might have provided only one value instead of two. Please provide offset as well as next values" });
    }
    else {
        return response.status(404).json({ message: "please choose between the respected values" });
    }
});
exports.getSupplier = getSupplier;
const getOneSupplier = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let id = request.params.id;
    let a = yield (yield connection_1.connect).query(`select * from [ecommerceDb1].[dbo].[Supplier] where Id =${id}`);
    if (a[0]) {
        return response.status(200).json({ message: "Required details have been fetched successfully", response: a });
    }
    else {
        return response.status(404).json({ message: "Invalid ID number, Please search with a valid ID number" });
    }
});
exports.getOneSupplier = getOneSupplier;
const insertIntoSupplier = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const newSupplier = {
        CompanyName: request.body.companyname,
        ContactName: request.body.contactname,
        ContactTitle: request.body.contacttitle,
        City: request.body.city,
        Country: request.body.country,
        Phone: request.body.phone,
        Fax: request.body.fax
    };
    if (newSupplier.CompanyName) {
        let a = yield (yield connection_1.connect).query(`insert into [ecommerceDb1].[dbo].[Supplier] ([CompanyName], [ContactName], 
            [ContactTitle], [City], [Country], [Phone], [Fax]) values('${newSupplier.CompanyName}',
            '${newSupplier.ContactName}','${newSupplier.ContactTitle}', '${newSupplier.City}','${newSupplier.Country}','${newSupplier.Phone}',
            '${newSupplier.Fax}')`);
        let newSupp = yield (yield connection_1.connect).query(`select *  from [Supplier] where CompanyName='${newSupplier.CompanyName}' 
            and ContactName = '${newSupplier.ContactName}'  
            and ContactTitle='${newSupplier.ContactTitle}' and City='${newSupplier.City}' and Country ='${newSupplier.Country}' 
            and Phone='${newSupplier.Phone}'
            and Fax='${newSupplier.Fax}'`);
        return response.status(200).json({ message: "Required details has been inserted successfully", response: newSupp });
    }
    else {
        return response.status(404).json({ message: "Please enter the company name which is mandatory!" });
    }
});
exports.insertIntoSupplier = insertIntoSupplier;
const updateAsupplier = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let id = request.params.id;
    let result = yield (yield connection_1.connect).query(`select top (1) * from [ecommerceDb1].[dbo].[Supplier] where Id=${id}`);
    if (!result[0]) {
        return response.status(404).json({ message: "please enter a valid id number" });
    }
    else {
        let CompanyName = request.body.CompanyName ? request.body.CompanyName : result[0].CompanyName;
        let ContactName = request.body.ContactName ? request.body.ContactName : result[0].ContactName;
        let ContactTitle = request.body.ContactTitle ? request.body.ContactTitle : result[0].ContactTitle;
        let City = request.body.City ? request.body.City : result[0].City;
        let Country = request.body.Country ? request.body.Country : result[0].Country;
        let Phone = request.body.Phone ? request.body.Phone : result[0].Phone;
        let Fax = request.body.Fax ? request.body.Fax : result[0].Fax;
        let query_response = yield (yield connection_1.connect).query(`update [ecommerceDb1].[dbo].[Supplier] set CompanyName='${CompanyName}',
        ContactName='${ContactName}',
        ContactTitle='${ContactTitle}',City='${City}',Country='${Country}',Phone='${Phone}',Fax='${Fax}'`);
        let updated_data = yield (yield connection_1.connect).query(`select * from [ecommerceDb1].[dbo].[Supplier] where id=${id}`);
        return response.status(200).json({ message: "We have successfully updated the record", updated_data: updated_data });
    }
});
exports.updateAsupplier = updateAsupplier;
const deleteASupplier = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let id = request.params.id;
    let result = yield (yield connection_1.connect).query(`select * from [ecommerceDb1].[dbo].[Supplier] where Id=${id}`);
    if (result[0]) {
        let deletedColumn = yield (yield connection_1.connect).query(`DELETE FROM [ecommerceDb1].[dbo].[Supplier] WHERE Id = ${id}`);
        return response.status(200).json({ message: 'post deleted successfully', response: deletedColumn });
    }
    else {
        return response.status(404).json({ message: " Please enter a valid id number " });
    }
});
exports.deleteASupplier = deleteASupplier;
//# sourceMappingURL=Supplier.js.map