import { Request, Response } from "express"
import express, { Express } from 'express';
import { connect } from "../connection/connection"
import { Not } from "typeorm";


//orderItem method 

export const getOrder = async (request:Request, response:Response)=>{
    let offset = request.query.offset
    let next = request.query.next
    let fieldname= request.query.fieldname
    let columnname = request.query.columnname
    //Pagination method
    if (offset && next){
        let a = await (await connect).query(`SELECT * FROM [ecommerceDb].[dbo].[Order] ORDER BY Id OFFSET ${offset} ROWS FETCH NEXT ${next} ROWS ONLY`)
        return response.status(200).json({message:"fetched requested data successfully", response:a})
    }
    else if(fieldname && columnname){
        let filteredData = await (await connect).query(`SELECT * FROM [ecommerceDb].[dbo].[Order] WHERE [${columnname}] LIKE '${fieldname}'`)
        console.log(filteredData)
        return response.status(200).json({message:"fetched requested data successfully", response:filteredData})
    }
    else if((fieldname && !columnname) || (!fieldname && columnname)){
        return response.send("you have provided either one of column name or fieldname please refiry and provide the details.")
    }
    //get all method
    else if(!offset && !next){ 
        let a = await (await connect).query(`SELECT * FROM [ecommerceDb].[dbo].[Order]`)
        return response.status(200).json({message:"fetched requested data successfully", response:a})
    }
    else if (!offset || !next){
        return response.send(" you might have provided only one value instead of two. Please provide offset as well as next values")
    }
    
    else{return response.send("please choose between the respected values")}
    }

//get one
export const getOneOrder = async(request:Request, response:Response) =>{
    let id = request.params.id
    let a = await (await connect).query(`select * from [ecommerceDb].[dbo].[Order] where Id =${id}`)
    if (a[0]){
        return response.status(200).json({message:"Required details have been fetched successfully", response: a})
    }
    else{
        return response.status(200).json({message:"Invalid ID number, Please search with a valid ID number"})
    }

}


//insert a record
export const insertIntoOrder = async (request: Request, response: Response)=>{
    const newOrder = {
        OrderDate: request.body.orderdate,
        OrderNumber: request.body.ordernumber,
        CustomerId: request.body.customerid,
        TotalAmount: request.body.totalamount,   
    }
    if(newOrder.OrderDate && newOrder.CustomerId){
        let a = await (await connect).query(`insert into [ecommerceDb].[dbo].[Order] ([OrderDate], [OrderNumber], 
            [CustomerId], [TotalAmount]) values(${newOrder.OrderDate},
            ${newOrder.OrderNumber},${newOrder.CustomerId}, ${newOrder.TotalAmount})`)
        
        let newOrd = await (await connect).query(`select *  from [ecommerceDb].[dbo].[Order] where OrderDate= ${newOrder.OrderDate} 
        and OrderNumber = ${newOrder.OrderNumber} and CustomerId=${newOrder.CustomerId} and TotalAmount=${newOrder.TotalAmount}`);
        
        return response.status(200).json({message:"Required details has been inserted successfully", response: newOrd})
    }
    else{
        return response.send("you have missed 'order date' or 'customer id' Please provide them as they are mandatory fields")
    }
}


export const updateAnOrder = async(request: Request, response: Response) => {
    let id = request.params.id;
    let result_id =await (await connect).query(`select top (1) * from [eCommerceDb].[dbo].[Order] where Id=${id}`);
    if (!result_id[0]){
        return response.send("please enter a valid id number")
    } 
    else{
        let OrderDate = request.body.OrderDate ? convert(request.body.OrderDate) : convert(result_id[0].OrderDate);
        let OrderNumber = request.body.OrderNumber ? request.body.OrderNumber : result_id[0].OrderNumber;
        let CustomerId = request.body.CustomerId ? request.body.CustomerId : result_id[0].CustomerId;
        let TotalAmount= request.body.TotalAmount ? request.body.TotalAmount :result_id[0].TotalAmount;
       
        let result = await (await connect).query(`UPDATE [eCommerceDb].[dbo].[Order]
            SET OrderDate='${OrderDate}',OrderNumber='${OrderNumber}',CustomerId=${CustomerId},TotalAmount=${TotalAmount}
            WHERE id = ${id};`);
        
            let updated_order = await (await connect).query(`select * from [eCommerceDb].[dbo].[Order] where OrderDate='${OrderDate}'
            and OrderNumber='${OrderNumber}'
            and CustomerId=${CustomerId} and TotalAmount=${TotalAmount}`)
            return response.status(200).json({message:"successfully updated data",updated_data:updated_order})    
    }
}

function convert(str:any) {
        var date = new Date(str),
          mnth = ("0" + (date.getMonth() + 1)).slice(-2),
          day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
      }



//delete data

export const deleteAnOrder = async(request: Request, response: Response) =>{
    let id = request.params.id;
    let result = await (await connect).query(`select * from [ecommerceDb].[dbo].[Order] where Id=${id}`);
    if (result[0]){
        let deletedColumn = await (await connect).query(`DELETE FROM [ecommerceDb].[dbo].[Order] WHERE Id = ${id}`);
        return response.status(200).json({message: 'post deleted successfully', response: deletedColumn})
    }
    else{
        return response.send(" Please enter a valid id number ")
    }
}














