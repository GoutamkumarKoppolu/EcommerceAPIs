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
exports.deleteAnOrder = exports.updateAnOrder = exports.insertIntoOrder = exports.getOneOrder = exports.getOrder = void 0;
const connection_1 = require("../connection/connection");
const getOrder = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let offset = request.query.offset;
    let next = request.query.next;
    let fieldname = request.query.fieldname;
    let columnname = request.query.columnname;
    if (offset && next) {
        let a = yield (yield connection_1.connect).query(`SELECT * FROM [ecommerceDb1].[dbo].[Order] ORDER BY Id OFFSET ${offset} ROWS FETCH NEXT ${next} ROWS ONLY`);
        return response.status(200).json({ message: "fetched requested data successfully", response: a });
    }
    else if (fieldname && columnname) {
        let filteredData = yield (yield connection_1.connect).query(`SELECT * FROM [ecommerceDb1].[dbo].[Order] WHERE [${columnname}] LIKE '%${fieldname}%'`);
        console.log(filteredData);
        return response.status(200).json({ message: "fetched requested data successfully", response: filteredData });
    }
    else if ((fieldname && !columnname) || (!fieldname && columnname)) {
        return response.status(404).json({ message: "you have provided either one of column name or fieldname please refiry and provide the details." });
    }
    else if (!offset && !next) {
        let a = yield (yield connection_1.connect).query(`SELECT * FROM [ecommerceDb1].[dbo].[Order]`);
        return response.status(200).json({ message: "fetched requested data successfully", response: a });
    }
    else if (!offset || !next) {
        return response.status(404).json({ message: " you might have provided only one value instead of two. Please provide offset as well as next values" });
    }
    else {
        return response.status(404).json({ message: "please choose between the respected values" });
    }
});
exports.getOrder = getOrder;
const getOneOrder = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let id = request.params.id;
    let a = yield (yield connection_1.connect).query(`select * from [ecommerceDb1].[dbo].[Order] where Id =${id}`);
    if (a[0]) {
        return response.status(200).json({ message: "Required details have been fetched successfully", response: a });
    }
    else {
        return response.status(200).json({ message: "Invalid ID number, Please search with a valid ID number" });
    }
});
exports.getOneOrder = getOneOrder;
const insertIntoOrder = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const newOrder = {
        OrderDate: request.body.orderdate,
        OrderNumber: request.body.ordernumber,
        CustomerId: request.body.customerid,
        TotalAmount: request.body.totalamount,
    };
    let presentDate = currentDate();
    if (presentDate && newOrder.CustomerId) {
        let a = yield (yield connection_1.connect).query(`insert into [ecommerceDb1].[dbo].[Order] ([OrderDate], [OrderNumber], 
            [CustomerId], [TotalAmount]) values(${presentDate},
            ${newOrder.OrderNumber},${newOrder.CustomerId}, ${newOrder.TotalAmount})`);
        let newOrd = yield (yield connection_1.connect).query(`select *  from [ecommerceDb1].[dbo].[Order] where OrderDate= ${presentDate} 
        and OrderNumber = ${newOrder.OrderNumber} and CustomerId=${newOrder.CustomerId} and TotalAmount=${newOrder.TotalAmount}`);
        return response.status(200).json({ message: "Required details has been inserted successfully", response: newOrd });
    }
    else {
        return response.status(404).json({ message: "you have missed 'order date' or 'customer id' Please provide them as they are mandatory fields" });
    }
});
exports.insertIntoOrder = insertIntoOrder;
const updateAnOrder = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let id = request.params.id;
    let result_id = yield (yield connection_1.connect).query(`select top (1) * from [ecommerceDb1].[dbo].[Order] where Id=${id}`);
    if (!result_id[0]) {
        return response.status(404).json({ message: "please enter a valid id number" });
    }
    else {
        let OrderDate = request.body.OrderDate ? convert(request.body.OrderDate) : convert(result_id[0].OrderDate);
        let OrderNumber = request.body.OrderNumber ? request.body.OrderNumber : result_id[0].OrderNumber;
        let CustomerId = request.body.CustomerId ? request.body.CustomerId : result_id[0].CustomerId;
        let TotalAmount = request.body.TotalAmount ? request.body.TotalAmount : result_id[0].TotalAmount;
        let result = yield (yield connection_1.connect).query(`UPDATE [ecommerceDb1].[dbo].[Order]
            SET OrderDate='${OrderDate}',OrderNumber='${OrderNumber}',CustomerId=${CustomerId},TotalAmount=${TotalAmount}
            WHERE id = ${id};`);
        let updated_order = yield (yield connection_1.connect).query(`select * from [ecommerceDb1].[dbo].[Order] where OrderDate='${OrderDate}'
            and OrderNumber='${OrderNumber}'
            and CustomerId=${CustomerId} and TotalAmount=${TotalAmount}`);
        return response.status(200).json({ message: "successfully updated data", updated_data: updated_order });
    }
});
exports.updateAnOrder = updateAnOrder;
function convert(str) {
    var date = new Date(str), mnth = ("0" + (date.getMonth() + 1)).slice(-2), day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
}
function currentDate() {
    let date = new Date();
    let mnth = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
}
const deleteAnOrder = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let id = request.params.id;
    let result = yield (yield connection_1.connect).query(`select * from [ecommerceDb1].[dbo].[Order] where Id=${id}`);
    if (result[0]) {
        let deletedColumn = yield (yield connection_1.connect).query(`DELETE FROM [ecommerceDb1].[dbo].[Order] WHERE Id = ${id}`);
        return response.status(200).json({ message: 'post deleted successfully', response: deletedColumn });
    }
    else {
        return response.status(404).json({ message: " Please enter a valid id number " });
    }
});
exports.deleteAnOrder = deleteAnOrder;
const orderGenerator = () => __awaiter(void 0, void 0, void 0, function* () {
    let valid = true;
    while (valid) {
        let autoGeneratedOrder = Math.floor(Math.random() * (600000 - 500000) + 500000);
        let existingOrder = yield (yield connection_1.connect).query(`select * from [ecommerceDb1].[dbo].[Order] where OrderNumber = ${autoGeneratedOrder}`);
        if (existingOrder[0]) {
            valid = true;
        }
        else {
            console.log(autoGeneratedOrder);
            return autoGeneratedOrder;
        }
    }
});
let a = orderGenerator();
console.log(a);
//# sourceMappingURL=Order.js.map