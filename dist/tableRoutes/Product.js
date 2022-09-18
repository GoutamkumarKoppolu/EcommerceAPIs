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
exports.deleteAProduct = exports.updateAProduct = exports.insertIntoProduct = exports.getOneProduct = exports.getProduct = void 0;
const connection_1 = require("../connection/connection");
const getProduct = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let offset = request.query.offset;
    let next = request.query.next;
    let fieldname = request.query.fieldname;
    let columnname = request.query.columnname;
    if (offset && next) {
        let a = yield (yield connection_1.connect).query(`SELECT * FROM [ecommerceDb1].[dbo].[Product] ORDER BY Id OFFSET ${offset} ROWS FETCH NEXT ${next} ROWS ONLY`);
        return response.status(200).json({ message: "fetched requested data successfully", response: a });
    }
    else if (fieldname && columnname) {
        let filteredData = yield (yield connection_1.connect).query(`SELECT * FROM [ecommerceDb1].[dbo].[Product] WHERE [${columnname}] LIKE '%${fieldname}%'`);
        console.log(filteredData);
        return response.status(200).json({ message: "fetched requested data successfully", response: filteredData });
    }
    else if ((fieldname && !columnname) || (!fieldname && columnname)) {
        return response.status(404).json({ message: "you have provided either one of column name or fieldname please refiry and provide the details." });
    }
    else if (!offset && !next) {
        let a = yield (yield connection_1.connect).query(`SELECT * FROM [ecommerceDb1].[dbo].[Product]`);
        return response.status(200).json({ message: "fetched requested data successfully", response: a });
    }
    else if (!offset || !next) {
        return response.status(404).json({ message: " you might have provided only one value instead of two. Please provide offset as well as next values" });
    }
    else {
        return response.status(404).json({ message: "please choose between the respected values" });
    }
});
exports.getProduct = getProduct;
const getOneProduct = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let id = request.params.id;
    let a = yield (yield connection_1.connect).query(`select * from [ecommerceDb1].[dbo].[Product] where Id =${id}`);
    if (a[0]) {
        return response.status(200).json({ message: "Required details have been fetched successfully", response: a });
    }
    else {
        return response.status(404).json({ message: "Invalid ID number, Please search with a valid ID number" });
    }
});
exports.getOneProduct = getOneProduct;
const insertIntoProduct = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const newProduct = {
        ProductName: request.body.productname,
        SupplierId: request.body.supplierid,
        UnitPrice: request.body.unitprice,
        Package: request.body.package,
        IsDiscontinued: request.body.isdiscontinued
    };
    if (newProduct.ProductName && newProduct.SupplierId && newProduct.IsDiscontinued) {
        let a = yield (yield connection_1.connect).query(`insert into [ecommerceDb1].[dbo].[Product] ([ProductName], [SupplierId], 
            [UnitPrice], [Package], [IsDiscontinued]) values('${newProduct.ProductName}',
            ${newProduct.SupplierId},${newProduct.UnitPrice}, '${newProduct.Package}','${newProduct.IsDiscontinued}')`);
        let newProd = yield (yield connection_1.connect).query(`select *  from [Product] where ProductName='${newProduct.ProductName}' 
        and SupplierId = ${newProduct.SupplierId}  
        and UnitPrice=${newProduct.UnitPrice} and Package='${newProduct.Package}' and IsDiscontinued ='${newProduct.IsDiscontinued}'`);
        return response.status(200).json({ message: "Required details has been inserted successfully", response: newProd });
    }
    else {
        return response.status(404).json({ message: " you might have missed one of the fields 'product name' or 'supplier id' or 'is discontinued' please verify the fields you missed and give proper value as they are mandatory!" });
    }
});
exports.insertIntoProduct = insertIntoProduct;
const updateAProduct = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let id = request.params.id;
    let result = yield (yield connection_1.connect).query(`select top (1) * from [ecommerceDb1].[dbo].[Product] where id=${id}`);
    if (!result[0]) {
        return response.status(404).json({ message: "please enter a valid id number" });
    }
    else {
        let ProductName = request.body.ProductName ? request.body.ProductName : result[0].ProductName;
        let SupplierId = request.body.SupplierId ? request.body.SupplierId : result[0].SupplierId;
        let UnitPrice = request.body.UnitPrice ? request.body.UnitPrice : result[0].UnitPrice;
        let Package = request.body.Package ? request.body.Package : result[0].Package;
        let IsDiscontinued = request.body.IsDiscontinued ? request.body.IsDiscontinued : result[0].IsDiscontinued;
        let query_response = yield (yield connection_1.connect).query(`update [ecommerceDb1].[dbo].[Product] set ProductName='${ProductName}',
        SupplierId=${SupplierId},UnitPrice=${UnitPrice},Package='${Package}',IsDiscontinued='${IsDiscontinued}'`);
        let updated_data = yield (yield connection_1.connect).query(`select * from [ecommerceDb1].[dbo].[Product] where id=${id}`);
        return response.status(200).json({ message: "successfully updated data", updated_data: updated_data });
    }
});
exports.updateAProduct = updateAProduct;
const deleteAProduct = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let id = request.params.id;
    let result = yield (yield connection_1.connect).query(`select * from [ecommerceDb1].[dbo].[Product] where Id=${id}`);
    if (result[0]) {
        let deletedColumn = yield (yield connection_1.connect).query(`DELETE FROM [ecommerceDb1].[dbo].[Product] WHERE Id = ${id}`);
        return response.status(200).json({ message: 'post deleted successfully', response: deletedColumn });
    }
    else {
        return response.status(404).json({ message: " Please enter a valid id number " });
    }
});
exports.deleteAProduct = deleteAProduct;
//# sourceMappingURL=Product.js.map