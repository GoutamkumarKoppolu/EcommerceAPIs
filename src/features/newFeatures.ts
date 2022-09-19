import {connect} from "../connection/connection"
import { Request, Response } from "express"

export const validateCustomer = async(request: Request, response: Response) =>{

    let phone = request.params.phone
    let isCusomer = await(await connect).query(`SELECT * FROM [ecommerceDb1].[dbo].[Customer] WHERE Phone = '${phone}' `)
    if (isCusomer[0]){
        return response.status(200).json({message:"The customer you are searching for is in the database", "customer Id": isCusomer})
    }
    else{
        return response.status(404).json({message:"Customer not found, Please enroll yourself"})
    }
}

export const deleteCompleteAccount = async(request: Request, response: Response) => {

    let Id = request.params.id
    let isCustomer = await(await connect).query(`SELECT * FROM [ecommerceDb1].[dbo].[Customer] WHERE id = '${Id}'`)
    if (!isCustomer[0]){
        return response.status(404).json({message:"the customer you are finding is not available"})
    }
    else{
        let deleteOrder = await (await connect).query(`SELECT [Id] FROM [ecommerceDb1].[dbo].[Order] WHERE CustomerId = ${Id}`)
        for(let i=0;i<deleteOrder.length;i++){           
            let deletableOrder = await (await connect).query(`DELETE FROM [ecommerceDb1].[dbo].[Order] WHERE CustomerId = ${deleteOrder[i].Id}`)
        }
        for(let i=0;i<deleteOrder.length;i++){
            let deleteOrderItem = await (await connect).query(`DELETE FROM [ecommerceDb1].[dbo].[OrderItem] WHERE OrderId = ${deleteOrder[i].Id}`)
        }
       let deletableCustomer = await(await connect).query(`DELETE FROM [ecommerceDb1].[dbo].[Customer] WHERE Id = '${Id}'`)
       return response.status(200).json({message:"selected accounts and their data has been removed completely"})
}
}

export const getItemsfromOrder =async (request:Request, response: Response) => {

    let customerOrderId = request.params.orderId
    let verifyOrderNumber = await(await connect).query(`SELECT * FROM [ecommerceDb1].[dbo].[OrderItem] WHERE OrderId = ${customerOrderId} `)
    if(!verifyOrderNumber[0]){
        return response.status(404).json({message: "Order Id you are searching doesn't exist "})
    }
    else{
        let getPrice = await(await connect).query(`SELECT [TotalAmount] FROM [ecommerceDb1].[dbo].[Order] WHERE Id = ${customerOrderId}`)

        let getOrders = await(await connect).query(`SELECT [ProductId]
        ,[UnitPrice]
        ,[Quantity] FROM [ecommerceDb1].[dbo].[OrderItem] WHERE OrderId = ${customerOrderId}`)
        let productNames = []
        for(let i=0; i < getOrders.length; i ++){
            let orderedProductNames = await(await connect).query(`SELECT [ProductName] FROM [ecommerceDb1].[dbo].[Product] WHERE Id = ${getOrders[i].ProductId}`)
            productNames.push(orderedProductNames)            
        }
        let completeDict = {}
        let completeList = []
        for(let i=0; i < getOrders.length; i++){
            let amnt = (getOrders[i].Quantity * getOrders[i].UnitPrice)
            completeDict = {"ProductName":productNames[i][0].ProductName, "ProductId": getOrders[i].ProductId, "Quantity": getOrders[i].Quantity, 
            "UnitPrice": getOrders[i].UnitPrice, "Amount": amnt}
            completeList.push(completeDict)
            if (i === (getOrders.length)-1){
                let TotalBill = {"Total Bill for the order" : getPrice[0].TotalAmount}
                completeList.push(TotalBill)
            }
        }
        return response.status(200).json({message: "Orders with order id found", "products": completeList})
    } 
}


export const deleteFromCart = async(request: Request, response: Response) => {

    let isValidId = request.query.orderid
    let productItems = request.query.productItems
    let totalAmount = await(await connect).query(`SELECT [TotalAmount] FROM [ecommerceDb1].[dbo].[Order] WHERE Id = ${isValidId}`)
    if (!totalAmount[0]){
        return response.status(404).json({message: "the ID number you entered is incorrect, please enter a valid id number"})
    }
    else if(totalAmount <= 0){
        return response.status(404).json({message: "Your cart Amount is empty, you didnt selected any products."})
    }
    else{
        let removableProduct =  await(await connect).query(`SELECT [UnitPrice], [Quantity], [productId] FROM [ecommerceDb1].[dbo].[OrderItem] 
        WHERE OrderId = ${isValidId} AND ProductId = ${productItems}`)
        if(!removableProduct[0]){
            return response.status(404).json({message: "Your cart doesnt contain the product with provided product ID."})
        }
        else{
            let removableAmount = Math.floor(removableProduct[0].UnitPrice * removableProduct[0].Quantity)
            let differenceAmount = Math.floor(totalAmount[0].TotalAmount - removableAmount)
            let removeProduct = await(await connect).query(`DELETE FROM [ecommerceDb1].[dbo].[OrderItem] WHERE OrderId = ${isValidId} AND ProductId = ${productItems}`)
            let updateTotalAmount = await(await connect).query(`UPDATE [ecommerceDb1].[dbo].[Order] SET TotalAmount = ${differenceAmount} WHERE Id = ${isValidId}`)
            return response.status(200).json({message: "We have removed the item from the cart successfully. please find the updated amount", "Current Balance": differenceAmount})
        }
    }
}

