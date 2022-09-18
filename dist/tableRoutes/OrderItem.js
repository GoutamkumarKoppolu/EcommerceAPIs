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
exports.deleteAOrderItem = exports.updateOrderItem = exports.insertIntoOrderItem = exports.getOneOrderItem = exports.getOrderItem = void 0;
const connection_1 = require("../connection/connection");
const getOrderItem = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let offset = request.query.offset;
    let next = request.query.next;
    let fieldname = request.query.fieldname;
    let columnname = request.query.columnname;
    if (offset && next) {
        let a = yield (yield connection_1.connect).query(`SELECT * FROM [ecommerceDb1].[dbo].[OrderItem] ORDER BY Id OFFSET ${offset} ROWS FETCH NEXT ${next} ROWS ONLY`);
        return response.status(200).json({ message: "fetched requested data successfully", response: a });
    }
    else if (fieldname && columnname) {
        let filteredData = yield (yield connection_1.connect).query(`SELECT * FROM [ecommerceDb1].[dbo].[OrderItem] WHERE [${columnname}] LIKE '%${fieldname}%'`);
        console.log(filteredData);
        return response.status(200).json({ message: "fetched requested data successfully", response: filteredData });
    }
    else if ((fieldname && !columnname) || (!fieldname && columnname)) {
        return response.status(404).json({ message: "you have provided either one of column name or fieldname please refiry and provide the details." });
    }
    else if (!offset && !next) {
        let a = yield (yield connection_1.connect).query(`SELECT * FROM [ecommerceDb1].[dbo].[OrderItem]`);
        return response.status(200).json({ message: "fetched requested data successfully", response: a });
    }
    else if (!offset || !next) {
        return response.status(404).json({ message: " you might have provided only one value instead of two. Please provide offset as well as next values" });
    }
    else {
        return response.status(404).json({ message: "please choose between the respected values" });
    }
});
exports.getOrderItem = getOrderItem;
const getOneOrderItem = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let id = request.params.id;
    let a = yield (yield connection_1.connect).query(`select * from [ecommerceDb1].[dbo].[OrderItem] where Id =${id}`);
    if (a[0]) {
        return response.status(200).json({ message: "Required details have been fetched successfully", response: a });
    }
    else {
        return response.status(404).json({ message: "Invalid ID number, Please search with a valid ID number" });
    }
});
exports.getOneOrderItem = getOneOrderItem;
const insertIntoOrderItem = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const newOrderItem = {
        OrderId: request.body.orderid,
        ProductId: request.body.productid,
        UnitPrice: request.body.unitprice,
        Quantity: request.body.quantity,
    };
    let a = yield (yield connection_1.connect).query(`insert into [ecommerceDb1].[dbo].[OrderItem] ([OrderId], [ProductId], 
    [UnitPrice], [Quantity]) values(${newOrderItem.OrderId},
    ${newOrderItem.ProductId},${newOrderItem.UnitPrice}, ${newOrderItem.Quantity})`);
    let newordItem = yield (yield connection_1.connect).query(`select *  from [ecommerceDb1].[dbo].[OrderItem] where OrderId=${newOrderItem.OrderId}
            and ProductId=${newOrderItem.ProductId}
            and UnitPrice=${newOrderItem.UnitPrice} and Quantity=${newOrderItem.Quantity}`);
    return response.status(200).json({ message: "Required details has been inserted successfully", response: newordItem });
});
exports.insertIntoOrderItem = insertIntoOrderItem;
const updateOrderItem = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let id = request.params.id;
    let result = yield (yield connection_1.connect).query(`select top (1) * from [ecommerceDb1].[dbo].[OrderItem] where Id=${id}`);
    if (!result[0]) {
        return response.status(404).json({ message: "please enter a valid id number" });
    }
    else {
        let OrderId = request.body.OrderId ? request.body.OrderId : result[0].OrderId;
        let ProductId = request.body.ProductId ? request.body.ProductId : result[0].ProductId;
        let UnitPrice = request.body.UnitPrice ? request.body.UnitPrice : result[0].UnitPrice;
        let Quantity = request.body.Quantity ? request.body.Quantity : result[0].Quantity;
        let queryResponse = yield (yield connection_1.connect).query(`UPDATE [ecommerceDb1].[dbo].[OrderItem]
            SET OrderId=${OrderId},ProductId=${ProductId},UnitPrice=${UnitPrice},Quantity=${Quantity}
            WHERE id = ${id};`);
        let updated_data = yield (yield connection_1.connect).query(`select * from [ecommerceDb1].[dbo].[OrderItem] where id=${id}`);
        return response.status(200).json({ message: "successfully updated data", updated_data: updated_data });
    }
});
exports.updateOrderItem = updateOrderItem;
const deleteAOrderItem = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let id = request.params.id;
    let result = yield (yield connection_1.connect).query(`select * from [ecommerceDb1].[dbo].[OrderItem] where Id=${id}`);
    if (result[0]) {
        let deletedColumn = yield (yield connection_1.connect).query(`DELETE FROM [ecommerceDb1].[dbo].[OrderItem] WHERE Id = ${id}`);
        return response.status(200).json({ message: 'post deleted successfully', response: deletedColumn });
    }
    else {
        return response.status(404).json({ message: " Please enter a valid id number " });
    }
});
exports.deleteAOrderItem = deleteAOrderItem;
//# sourceMappingURL=OrderItem.js.map