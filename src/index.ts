import { connect } from "./connection/connection";
import express, { Express } from 'express';
import { Request, Response, NextFunction } from 'express';
import { getCustomer, getOneCustomer, insertIntoCustomer, updateACustomer, deleteACustomer} from "./tableRoutes/Customer";
import { getSupplier, getOneSupplier, insertIntoSupplier, updateAsupplier, deleteASupplier } from "./tableRoutes/Supplier";
import { getProduct, getOneProduct, insertIntoProduct, updateAProduct, deleteAProduct } from "./tableRoutes/Product";
import { getOrderItem, getOneOrderItem, insertIntoOrderItem, updateOrderItem, deleteAOrderItem } from "./tableRoutes/OrderItem";
import { getOrder, getOneOrder, insertIntoOrder, updateAnOrder, deleteAnOrder } from "./tableRoutes/Order"; 
import { deleteCompleteAccount, deleteFromCart, getItemsfromOrder, validateCustomer } from "./features/newFeatures";
import { addToCart, checkOut, getFullBill} from "./features/addTocartFeature"



const app: Express = express()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.listen(3000, ()=>{
    console.log("Server started");
})

// All Tables get methods
//get all and pagination
//customer
app.get("/Customer", getCustomer)
//Supplier
app.get("/Supplier", getSupplier)
//product
app.get("/Product", getProduct)
//OrderItem
app.get("/OrderItem", getOrderItem)
//Order
app.get("/Order", getOrder)


//get by ID
//Customer
app.get("/Customer/:id", getOneCustomer)
//Supplier
app.get("/Supplier/:id", getOneSupplier)
//Product
app.get("/Product/:id", getOneProduct)
//OrderItem
app.get("/OrderItem/:id", getOneOrderItem)
//Order
app.get("/Order/:id", getOneOrder)

//insertion 
//Customer
app.post("/Customer", insertIntoCustomer)
//Supplier
app.post("/Supplier", insertIntoSupplier)
//product
app.post("/Product", insertIntoProduct)
//OrderItem
app.post("/OrderItem", insertIntoOrderItem)
//Order
app.post("/Order", insertIntoOrder)


//updation
//customer
app.put("/Customer/:id", updateACustomer)
//Supplier
app.put("/Supplier/:id", updateAsupplier)
//Product
app.put("/Product/:id", updateAProduct)
//OrderItem
app.put("/OrderItem/:id", updateOrderItem)
//order
app.put("/Order/:id", updateAnOrder)


//deletion
//customer
app.delete("/Customer/:id", deleteACustomer)
//Supplier
app.delete("/Supplier/:id", deleteASupplier)
//Product
app.delete("/Product/:id", deleteAProduct)
//OrderItem
app.delete("/OrderItem/:id", deleteAOrderItem)
//order
app.delete("/Order/:id", deleteAnOrder)



//special features

app.get("/Customer/validate/:phone", validateCustomer)

//delete an account

app.delete("/deleteAccount/:id", deleteCompleteAccount)

//getOrderItems

app.get("/getOrders/:orderId", getItemsfromOrder)

//deletefromcart

app.delete("/deleteFromCart", deleteFromCart)

// add to cart
app.post("/addToCart", addToCart)

//get full bill
app.get("/getFullBill/:Id", getFullBill)

//checkout
app.put("/checkOut/:Id", checkOut)
