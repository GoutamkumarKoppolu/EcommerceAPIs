import {connect} from "../connection/connection"
import { Request, Response } from "express"

export const addToCart = async(request: Request, response: Response)=>{

    let items:{Product:number,Quantity:number}[] = request.body.items;
    let CustomerId = request.body.CustomerId

    let isValidId = await(await connect).query(`SELECT * FROM [ecommerceDb1].[dbo].[Customer] where Id = ${CustomerId}`)
    if(!isValidId[0]){
        return response.status(404).json({message: "The customer you are searching doesn't exist, please enroll yourself."})
    }
    else{
        let isHavingOrderId = await(await connect).query(`SELECT TOP (1) [Id]
        ,[OrderDate]
        ,[OrderNumber]
        ,[CustomerId]
        ,[TotalAmount], [IsCheckedOut]
        FROM [ecommerceDb1].[dbo].[Order] where CustomerId = ${CustomerId} ORDER BY OrderDate DESC`)

        let orderIdQueue = []
        if(!isHavingOrderId[0]){
            let totalAmount = 0
            let valid = true
            let autoGeneratorQueue = [1]
            while (valid){
                let autoGeneratedOrder = Math.floor(Math.random() * (600000 - 500000) + 500000)

                let existingOrder = await(await connect).query(`select * from [ecommerceDb1].[dbo].[Order] where OrderNumber = ${autoGeneratedOrder}`)
                
                if(!existingOrder[0] && !autoGeneratorQueue[1]){
                    autoGeneratorQueue.push(autoGeneratedOrder)
                    break
                }
                else if (existingOrder[0]){
                    valid = true
                }
            }
            let autoGeneratedNumber = autoGeneratorQueue[1]
            autoGeneratorQueue.pop()
            let presentDate = currentDate()

            let a = await (await connect).query(`insert into [ecommerceDb1].[dbo].[Order] ([OrderDate], [OrderNumber], 
                [CustomerId], [TotalAmount]) values(${presentDate},
                ${autoGeneratedNumber},${CustomerId}, ${totalAmount})`)      
            let newOrd = await (await connect).query(`select [Id]  from [ecommerceDb1].[dbo].[Order] where OrderDate= ${presentDate} 
                and OrderNumber = ${autoGeneratedNumber} and CustomerId=${CustomerId} and TotalAmount=${totalAmount}`);
            let orderId = newOrd[0].Id   
            orderIdQueue.push(orderId)
        }

        else if(isHavingOrderId[0] && (isHavingOrderId[0].TotalAmount === 0) && (isHavingOrderId[0].IsCheckedOut === 1)){
            let totalAmount = 0
            let valid = true
            let autoGeneratorQueue = [1]
            while (valid){
                let autoGeneratedOrder = Math.floor(Math.random() * (600000 - 500000) + 500000)

                let existingOrder = await(await connect).query(`select * from [ecommerceDb1].[dbo].[Order] where OrderNumber = ${autoGeneratedOrder}`)
                
                if(!existingOrder[0] && !autoGeneratorQueue[1]){
                    autoGeneratorQueue.push(autoGeneratedOrder)
                    break
                }
                else if (existingOrder[0]){
                    valid = true
                }
            }
            let autoGeneratedNumber = autoGeneratorQueue[1]
            autoGeneratorQueue.pop()
            let presentDate = currentDate()

            let a = await (await connect).query(`insert into [ecommerceDb1].[dbo].[Order] ([OrderDate], [OrderNumber], 
                [CustomerId], [TotalAmount]) values(${presentDate},
                ${autoGeneratedNumber},${CustomerId}, ${totalAmount})`)      
            let newOrd = await (await connect).query(`select [Id]  from [ecommerceDb1].[dbo].[Order] where OrderDate= ${presentDate} 
                and OrderNumber = ${autoGeneratedNumber} and CustomerId=${CustomerId} and TotalAmount=${totalAmount}`);
            let orderId = newOrd[0].Id
            orderIdQueue.push(orderId)   
            
        }
        else if(isHavingOrderId[0] && (isHavingOrderId[0].TotalAmount > 0) && (isHavingOrderId[0].IsCheckedOut !== 1)){
            let isCheckingOut = await(await connect).query(`UPDATE [ecommerceDb1].[dbo].[Order] SET IsCheckedOut = 0 where Id = ${isHavingOrderId[0].Id}`)
            let orderId = isHavingOrderId[0].Id
            orderIdQueue.push(orderId)
        }
        let orderId = orderIdQueue[0]
        orderIdQueue.pop()
        let discontinuedList = []
        let addedItemsForCart = []
        for(let i = 0; i<items.length; i++){
            let productRate = await(await connect).query(`SELECT * FROM [ecommerceDb1].[dbo].[Product] WHERE Id = ${items[i].Product} and IsDiscontinued=0`)
            // console.log(items[i].Quantity)
            // console.log(orderId)
            // console.log(items[i].Product)
            // console.log(productRate[i].UnitPrice)
            
            if(productRate[0]){
                let addNewProducts = await(await connect).query(`insert into [ecommerceDb1].[dbo].[OrderItem] ([OrderId], [ProductId], 
                    [UnitPrice], [Quantity]) values(${orderId},${items[i].Product},${productRate[0].UnitPrice}, ${items[i].Quantity})`)
                let cartAddedProducts = await(await connect).query(`select * from [eCommerceDb1].[dbo].[OrderItem] 
                where OrderId = ${orderId} and
                 ProductId=${items[i].Product}`)
                 addedItemsForCart.push(cartAddedProducts)
            }
            else{
                discontinuedList.push(productRate.Id)
            }
        }
        let amountCalculation = await(await connect).query(`SELECT * FROM [ecommerceDb1].[dbo].[OrderItem] WHERE OrderId = ${orderId}`)
        
        let amount = [0]
        for(let i =1; i<amountCalculation.length; i++){
            amount[0] = amount[0] + (amountCalculation[i].UnitPrice * amountCalculation[i].Quantity)
        }
        let changeAmount = await(await connect).query(`update [ecommerceDb1].[dbo].[Order] SET TotalAmount = ${amount[0]} where Id = ${orderId}`)

        return response.status(200).json({
            "customer Id": CustomerId,
            "products": addedItemsForCart,
            "unavailable Products Ids": discontinuedList
        })
    }
}



function convert(str:any) {

    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }


function currentDate(){

let date = new Date()
let mnth = ("0" + (date.getMonth() + 1)).slice(-2)
let day = ("0" + date.getDate()).slice(-2)
return [date.getFullYear(), mnth, day].join("-");
}


export const getFullBill = async(request: Request, response: Response) => {

    let CustomerId = request.params.Id
    
    let totalBillQueue = await(await connect).query(`Select [Id],[TOtalAmount] from [ecommerceDb1].[dbo].[Order] where CustomerId = ${CustomerId}`)
    let totalAmount = [0]
    for(let i = 0; i< totalBillQueue.length; i++){
        totalAmount[0] = totalAmount[0] + totalBillQueue[i].TOtalAmount
    }
    if (totalAmount[0] === 0){
        return response.status(200).json({message: "Customer has paid for the complete orders"})
    }
    else{
        return response.status(200).json({"Complete cart amount": totalAmount[0], "Order IDs": totalBillQueue})
    }
}

export const checkOut = async(request: Request, response: Response) => {
    let CustomerId = request.params.Id
    
    let totalBillQueue = await(await connect).query(`Select [Id],[TOtalAmount] from [ecommerceDb1].[dbo].[Order] where CustomerId = ${CustomerId}`)
    let totalAmount = [0]
    for(let i = 0; i< totalBillQueue.length; i++){
        totalAmount[0] = totalAmount[0] + totalBillQueue[i].TOtalAmount
    }
    if (totalAmount[0] === 0){
        return response.status(200).json({message: "Customer has already paid for all the orders."})
    }
    else{
        let emptyTotalAMount = await(await connect).query(`UPDATE [ecommerceDb1].[dbo].[Order] SET TotalAmount = 0 where CustomerId = ${CustomerId}`)
        let getCheckOut = await(await connect).query(`UPDATE [ecommerceDb1].[dbo].[Order] SET IsCheckedOut = 1 where CustomerId = ${CustomerId}`)
        return response.status(200).json({"Amount Paid": totalAmount[0], "Order IDs": totalBillQueue, "Thanks for Choosing our products": "visit us Again"})
    }


}