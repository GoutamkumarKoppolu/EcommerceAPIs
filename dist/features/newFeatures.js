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
exports.deleteCompleteAccount = exports.validateCustomer = void 0;
const connection_1 = require("../connection/connection");
const validateCustomer = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let phone = request.params.phone;
    let isCusomer = yield (yield connection_1.connect).query(`SELECT * FROM [ecommerceDb1].[dbo].[Customer] WHERE Phone = '${phone}' `);
    if (isCusomer[0]) {
        return response.status(200).json({ message: "The customer you are searching for is in the database", response: isCusomer });
    }
    else {
        return response.status(404).json({ message: "Customer not found, Please enroll yourself" });
    }
});
exports.validateCustomer = validateCustomer;
const deleteCompleteAccount = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let Id = request.params.id;
    let isCustomer = yield (yield connection_1.connect).query(`SELECT * FROM [ecommerceDb1].[dbo].[Customer] WHERE id = '${Id}'`);
    if (!isCustomer[0]) {
        return response.status(404).json({ message: "the customer you are finding is not available" });
    }
    else {
        let deleteOrder = yield (yield connection_1.connect).query(`SELECT [Id] FROM [ecommerceDb1].[dbo].[Order] WHERE CustomerId = ${Id}`);
        for (let i = 0; i < deleteOrder.length; i++) {
            let deletableOrder = yield (yield connection_1.connect).query(`DELETE FROM [ecommerceDb1].[dbo].[Order] WHERE CustomerId = ${Number(deleteOrder[i])}`);
        }
        for (let i = 0; i < deleteOrder.length; i++) {
            let deleteOrderItem = yield (yield connection_1.connect).query(`DELETE FROM [ecommerceDb1].[dbo].[OrderItem] WHERE OrderId = ${Number(deleteOrder[i])}`);
        }
        let deletableCustomer = yield (yield connection_1.connect).query(`DELETE FROM [ecommerceDb1].[dbo].[Customer] WHERE Id = '${Id}'`);
        return response.status(200).json({ message: "selected data deleted" });
    }
});
exports.deleteCompleteAccount = deleteCompleteAccount;
//# sourceMappingURL=newFeatures.js.map