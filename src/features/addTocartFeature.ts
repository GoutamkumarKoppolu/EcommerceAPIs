import {connect} from "../connection/connection"
import { Request, Response } from "express"

export const addToCart = async(request: Request, response: Response)=>{
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
        else if(isHavingOrderId[0] && (isHavingOrderId[0].TotalAmount > 0) && ((isHavingOrderId[0].IsCheckedOut === 0))||(isHavingOrderId[0].IsCheckedOut === null)){
            let orderId = isHavingOrderId[0].Id   
            orderIdQueue.push(orderId)
        }
        let orderId = orderIdQueue[0]
        orderIdQueue.pop()
        console.log(orderId)
        console.log(orderIdQueue)


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