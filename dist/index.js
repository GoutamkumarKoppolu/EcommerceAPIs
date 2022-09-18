"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Customer_1 = require("./tableRoutes/Customer");
const Supplier_1 = require("./tableRoutes/Supplier");
const Product_1 = require("./tableRoutes/Product");
const OrderItem_1 = require("./tableRoutes/OrderItem");
const Order_1 = require("./tableRoutes/Order");
const newFeatures_1 = require("./features/newFeatures");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.listen(3000, () => {
    console.log("Server started");
});
app.get("/Customer", Customer_1.getCustomer);
app.get("/Supplier", Supplier_1.getSupplier);
app.get("/Product", Product_1.getProduct);
app.get("/OrderItem", OrderItem_1.getOrderItem);
app.get("/Order", Order_1.getOrder);
app.get("/Customer/:id", Customer_1.getOneCustomer);
app.get("/Supplier/:id", Supplier_1.getOneSupplier);
app.get("/Product/:id", Product_1.getOneProduct);
app.get("/OrderItem/:id", OrderItem_1.getOneOrderItem);
app.get("/Order/:id", Order_1.getOneOrder);
app.post("/Customer", Customer_1.insertIntoCustomer);
app.post("/Supplier", Supplier_1.insertIntoSupplier);
app.post("/Product", Product_1.insertIntoProduct);
app.post("/OrderItem", OrderItem_1.insertIntoOrderItem);
app.post("/Order", Order_1.insertIntoOrder);
app.put("/Customer/:id", Customer_1.updateACustomer);
app.put("/Supplier/:id", Supplier_1.updateAsupplier);
app.put("/Product/:id", Product_1.updateAProduct);
app.put("/OrderItem/:id", OrderItem_1.updateOrderItem);
app.put("/Order/:id", Order_1.updateAnOrder);
app.delete("/Customer/:id", Customer_1.deleteACustomer);
app.delete("/Supplier/:id", Supplier_1.deleteASupplier);
app.delete("/Product/:id", Product_1.deleteAProduct);
app.delete("/OrderItem/:id", OrderItem_1.deleteAOrderItem);
app.delete("/Order/:id", Order_1.deleteAnOrder);
app.get("/Customer/validate/:phone", newFeatures_1.validateCustomer);
app.delete("/deleteAccount/:id", newFeatures_1.deleteCompleteAccount);
//# sourceMappingURL=index.js.map