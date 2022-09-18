import { Request, Response } from "express"
import express, { Express } from 'express';
import { connect } from "../connection/connection"
import { request } from "http";


// get Method
export const getCustomer = async (request:Request, response:Response) => {

        let offset = request.query.offset
        let next = request.query.next
        let fieldname= request.query.fieldname
        let columnname = request.query.columnname
        
        //customer pagination
        if (offset && next){
            let a = await (await connect).query(`SELECT * FROM [ecommerceDb1].[dbo].[Customer] ORDER BY Id OFFSET ${offset} ROWS FETCH NEXT ${next} ROWS ONLY`)
            return response.status(200).json({message:"fetched requested data successfully", response:a})
        }
        else if(fieldname && columnname){
            let filteredData = await (await connect).query(`SELECT * FROM [ecommerceDb1].[dbo].[Customer] WHERE [${columnname}] LIKE '%${fieldname}%'`)           
            return response.status(200).json({message:"fetched requested data successfully", response:filteredData})
        }
        else if((fieldname && !columnname) || (!fieldname && columnname)){
            return response.status(404).json({message:"you have provided incorrect details, please verify from your end."})
        }
        //get all method
        else if(!offset && !next){
            let a = await (await connect).query(`SELECT * FROM [ecommerceDb1].[dbo].[Customer]`)
            return response.status(200).json({message:"fetched requested data successfully", response:a})
        }
        else if (!offset || !next){
            return response.status(404).json({message: "you might have provided only one value instead of two. Please provide offset as well as next values"})
        }       
        else{return response.status(404).json({message:"please choose between the respected values"})}
    }



//get one
export const getOneCustomer = async(request:Request, response:Response) =>{

    let id = request.params.id
    let a = await (await connect).query(`select * from [ecommerceDb1].[dbo].[Customer] where Id =${id}`)
    if (a[0]){
        return response.status(200).json({message:"Required details have been fetched successfully", response: a})
    }
    else{
        return response.status(404).json({message:"Invalid ID number, Please search with a valid ID number"})
    }
}

//insert record
export const insertIntoCustomer = async (request: Request, response: Response)=>{

    const newCustomer = {
    FirstName : request.body.firstname,
    LastName : request.body.lastname,
    City : request.body.city,
    Country : request.body.country,
    Phone : request.body.phone,
}
    if(newCustomer.FirstName && newCustomer.LastName){
        let a = await (await connect).query(`insert into [ecommerceDb1].[dbo].[Customer] ([FirstName], 
            [LastName], [City], [Country], [Phone]) values('${newCustomer.FirstName}','${newCustomer.LastName}',
            '${newCustomer.City}', '${newCustomer.Country}','${newCustomer.Phone}')`)
        let newCust = await (await connect).query(`select *  from [ecommerceDb1].[dbo].[Customer] where FirstName='${newCustomer.FirstName}' and LastName = '${newCustomer.LastName}'  
        and City='${newCustomer.City}' and Country ='${newCustomer.Country}' and Phone='${newCustomer.Phone}'`);       
        return response.status(200).json({message:"Required details has been inserted successfully", response: newCust})
    }
    else if(!newCustomer.FirstName){
        return response.status(404).json({message:" you have forgot to send first name, please send the first name"})
    }
    else{
        return response.status(404).json({message:" you have forgot to send last name please send the last name"})
    }
}


//update record
export const updateACustomer = async(request:Request, response:Response)=>{

    let id:string = request.params.id;
    let result_id = await (await connect).query(`select * from [ecommerceDb1].[dbo].[Customer] where Id=${id}`);
    if (!result_id[0]){
        return response.status(404).json({message:"please enter a valid id number"})
    } 
    else{
        let FirstName = request.body.FirstName ? request.body.FirstName : result_id[0].FirstName;
        let LastName = request.body.LastName ? request.body.LastName : result_id[0].LastName;
        let City = request.body.City ? request.body.City : result_id[0].City;
        let Country= request.body.Country ? request.body.Country :result_id[0].Country;
        let Phone = request.body.Phone ? request.body.Phone : result_id[0].Phone;
        let result = await (await connect).query(`UPDATE [ecommerceDb1].[dbo].[Customer] 
        SET FirstName='${FirstName}',LastName='${LastName}',City='${City}',Country='${Country}',Phone='${Phone}' WHERE id = ${id};`);
        let updated_row = await (await connect).query(`select top (1) * from [ecommerceDb1].[dbo].[Customer] where Id=${id}`);
        return response.status(200).json({message: "successfully updated", response: updated_row})
    }
}
  

export const deleteACustomer = async (request: Request, response: Response) =>{

    let id = request.params.id;
    let result = await (await connect).query(`select * from [ecommerceDb1].[dbo].[Customer] where Id=${id}`);
    if (result[0]){
        let deletedColumn = await (await connect).query(`DELETE FROM [ecommerceDb1].[dbo].[Customer] WHERE Id = ${id}`);
        return response.status(200).json({message: 'post deleted successfully', response: deletedColumn})
    }
    else{
        return response.status(404).json({message:" Please enter a valid id number "})
    }
}
