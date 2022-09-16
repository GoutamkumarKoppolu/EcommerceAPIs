import { Request, Response } from "express"
import express, { Express } from 'express';
import { connect } from "../connection/connection"


export const getProduct = async (request:Request, response:Response) => {
    let offset = request.query.offset
    let next = request.query.next
    let fieldname= request.query.fieldname
    let columnname = request.query.columnname
    //customer pagination
    if (offset && next){
        let a = await (await connect).query(`SELECT * FROM [ecommerceDb].[dbo].[Product] ORDER BY Id OFFSET ${offset} ROWS FETCH NEXT ${next} ROWS ONLY`)
        return response.status(200).json({message:"fetched requested data successfully", response:a})
    }
    else if(fieldname && columnname){
        let filteredData = await (await connect).query(`SELECT * FROM [ecommerceDb].[dbo].[Product] WHERE [${columnname}] LIKE '${fieldname}'`)
        console.log(filteredData)
        return response.status(200).json({message:"fetched requested data successfully", response:filteredData})
    }
    else if((fieldname && !columnname) || (!fieldname && columnname)){
        return response.send("you have provided either one of column name or fieldname please refiry and provide the details.")
    }
    //get all method
    else if(!offset && !next){
        let a = await (await connect).query(`SELECT * FROM [ecommerceDb].[dbo].[Product]`)
        return response.status(200).json({message:"fetched requested data successfully", response:a})
    }
    else if (!offset || !next){
        return response.send(" you might have provided only one value instead of two. Please provide offset as well as next values")
    }
    
    else{return response.send("please choose between the respected values")}
}

//get one
export const getOneProduct = async(request:Request, response:Response) =>{
    let id = request.params.id
    let a = await (await connect).query(`select * from [ecommerceDb].[dbo].[Product] where Id =${id}`)
    if (a[0]){
        return response.status(200).json({message:"Required details have been fetched successfully", response: a})
    }
    else{
        return response.status(200).json({message:"Invalid ID number, Please search with a valid ID number"})
    }

}


//insert a record
export const insertIntoProduct = async (request: Request, response: Response)=>{
    const newProduct = {
        ProductName: request.body.productname,
        SupplierId: request.body.supplierid,
        UnitPrice: request.body.unitprice,
        Package: request.body.package,
        IsDiscontinued: request.body.isdiscontinued  
    }
    if(newProduct.ProductName && newProduct.SupplierId && newProduct.IsDiscontinued){
        let a = await (await connect).query(`insert into [ecommerceDb].[dbo].[Product] ([ProductName], [SupplierId], 
            [UnitPrice], [Package], [IsDiscontinued]) values('${newProduct.ProductName}',
            ${newProduct.SupplierId},${newProduct.UnitPrice}, '${newProduct.Package}','${newProduct.IsDiscontinued}')`)
        
        let newProd = await (await connect).query(`select *  from [Product] where ProductName='${newProduct.ProductName}' 
        and SupplierId = ${newProduct.SupplierId}  
        and UnitPrice=${newProduct.UnitPrice} and Package='${newProduct.Package}' and IsDiscontinued ='${newProduct.IsDiscontinued}'`);
                        
        return response.status(200).json({message:"Required details has been inserted successfully", response: newProd})
    }
    else{
        return response.send(" you might have missed one of the fields 'product name' or 'supplier id' or 'is discontinued' please verify the fields you missed and give proper value as they are mandatory!")
    }
}


//updating

//update a record
export const updateAProduct = async(request:Request, response:Response) =>{
    let id = request.params.id;
    let result = await(await connect).query(`select top (1) * from [eCommerceDb].[dbo].[Product] where id=${id}`);
    if (!result[0]){
        return response.send("please enter a valid id number")
    }
    else{
        let ProductName =request.body.ProductName?request.body.ProductName:result[0].ProductName;
        let SupplierId = request.body.SupplierId?request.body.SupplierId:result[0].SupplierId;
        let UnitPrice = request.body.UnitPrice?request.body.UnitPrice:result[0].UnitPrice;
        let Package = request.body.Package?request.body.Package:result[0].Package;
        let IsDiscontinued= request.body.IsDiscontinued?request.body.IsDiscontinued:result[0].IsDiscontinued;
        let query_response = await(await connect).query(`update [eCommerceDb].[dbo].[Product] set ProductName='${ProductName}',
        SupplierId=${SupplierId},UnitPrice=${UnitPrice},Package='${Package}',IsDiscontinued='${IsDiscontinued}'`);

        let updated_data = await(await connect).query(`select * from [eCommerceDb].[dbo].[Product] where id=${id}`);
        return response.status(200).json({message:"success fully updated data",updated_data:updated_data})
    }
}

//deleting a record
export const deleteAProduct = async(request: Request, response: Response) =>{
    let id = request.params.id;
    let result = await (await connect).query(`select * from [ecommerceDb].[dbo].[Product] where Id=${id}`);
    if (result[0]){
        let deletedColumn = await (await connect).query(`DELETE FROM [ecommerceDb].[dbo].[Product] WHERE Id = ${id}`);
        return response.status(200).json({message: 'post deleted successfully', response: deletedColumn})
    }
    else{
        return response.send(" Please enter a valid id number ")
    }
}

