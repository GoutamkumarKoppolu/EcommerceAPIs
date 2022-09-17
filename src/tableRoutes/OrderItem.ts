import { Request, Response } from "express"
import express, { Express } from 'express';
import { connect } from "../connection/connection"


//orderItem method 

export const getOrderItem = async (request:Request, response:Response)=>{
    let offset = request.query.offset
    let next = request.query.next
    let fieldname= request.query.fieldname
    let columnname = request.query.columnname
        //Pagination method
    if (offset && next){
        let a = await (await connect).query(`SELECT * FROM [ecommerceDb1].[dbo].[OrderItem] ORDER BY Id OFFSET ${offset} ROWS FETCH NEXT ${next} ROWS ONLY`)
        return response.status(200).json({message:"fetched requested data successfully", response:a})
    }
    else if(fieldname && columnname){
        let filteredData = await (await connect).query(`SELECT * FROM [ecommerceDb1].[dbo].[OrderItem] WHERE [${columnname}] LIKE '%${fieldname}%'`)
        console.log(filteredData)
        return response.status(200).json({message:"fetched requested data successfully", response:filteredData})
    }
    else if((fieldname && !columnname) || (!fieldname && columnname)){
        return response.status(404).json({message:"you have provided either one of column name or fieldname please refiry and provide the details."})
    }

    //get all method
    else if(!offset && !next){
        let a = await (await connect).query(`SELECT * FROM [ecommerceDb1].[dbo].[OrderItem]`)
        return response.status(200).json({message:"fetched requested data successfully", response:a})
    }
    else if (!offset || !next){
        return response.status(404).json({message:" you might have provided only one value instead of two. Please provide offset as well as next values"})
    }
    
    else{return response.status(404).json({message:"please choose between the respected values"})}
}


//get one
export const getOneOrderItem = async(request:Request, response:Response) =>{
    let id = request.params.id
    let a = await (await connect).query(`select * from [ecommerceDb1].[dbo].[OrderItem] where Id =${id}`)
    if (a[0]){
        return response.status(200).json({message:"Required details have been fetched successfully", response: a})
    }
    else{
        return response.status(404).json({message:"Invalid ID number, Please search with a valid ID number"})
    }

}


//insert a record
export const insertIntoOrderItem = async (request: Request, response: Response)=>{
    const newOrderItem = {
        OrderId: request.body.orderid,
        ProductId: request.body.productid,
        UnitPrice: request.body.unitprice,
        Quantity: request.body.quantity,
        
}
let a = await (await connect).query(`insert into [ecommerceDb1].[dbo].[OrderItem] ([OrderId], [ProductId], 
    [UnitPrice], [Quantity]) values(${newOrderItem.OrderId},
    ${newOrderItem.ProductId},${newOrderItem.UnitPrice}, ${newOrderItem.Quantity})`)

    
let newordItem = await (await connect).query(`select *  from [ecommerceDb1].[dbo].[OrderItem] where OrderId=${newOrderItem.OrderId}
            and ProductId=${newOrderItem.ProductId}
            and UnitPrice=${newOrderItem.UnitPrice} and Quantity=${newOrderItem.Quantity}`);

return response.status(200).json({message:"Required details has been inserted successfully", response: newordItem})

}


//updating order item

export const updateOrderItem = async(request:Request, response: Response) =>{
    let id:string=request.params.id;
    let result =await (await connect).query(`select top (1) * from [ecommerceDb1].[dbo].[OrderItem] where Id=${id}`);
    if (!result[0]){
        return response.status(404).json({message:"please enter a valid id number"})
    }
    else{
        let OrderId =request.body.OrderId ? request.body.OrderId : result[0].OrderId;
        let ProductId = request.body.ProductId ? request.body.ProductId : result[0].ProductId;
        let UnitPrice=request.body.UnitPrice ? request.body.UnitPrice : result[0].UnitPrice;
        let Quantity= request.body.Quantity ? request.body.Quantity :result[0].Quantity;
        let queryResponse = await (await connect).query(`UPDATE [ecommerceDb1].[dbo].[OrderItem]
            SET OrderId=${OrderId},ProductId=${ProductId},UnitPrice=${UnitPrice},Quantity=${Quantity}
            WHERE id = ${id};`);

        let updated_data = await(await connect).query(`select * from [ecommerceDb1].[dbo].[OrderItem] where id=${id}`);
        return response.status(200).json({message:"successfully updated data",updated_data:updated_data})
    }
}



// deleting a post
export const deleteAOrderItem = async(request: Request, response: Response) =>{
    let id = request.params.id;
    let result = await (await connect).query(`select * from [ecommerceDb1].[dbo].[OrderItem] where Id=${id}`);
    if (result[0]){
        let deletedColumn = await (await connect).query(`DELETE FROM [ecommerceDb1].[dbo].[OrderItem] WHERE Id = ${id}`);
        return response.status(200).json({message: 'post deleted successfully', response: deletedColumn})
    }
    else{
        return response.status(404).json({message:" Please enter a valid id number "})
    }
}










