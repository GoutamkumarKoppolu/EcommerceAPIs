import { Request, Response } from "express"
import express, { Express } from 'express';
import { connect } from "../connection/connection"


//supliers method 

export const getSupplier = async (request:Request, response:Response)=>{
    
    let offset = request.query.offset
    let next = request.query.next
    let fieldname= request.query.fieldname
    let columnname = request.query.columnname
    //Pagination method
    if (offset && next){
        let a = await (await connect).query(`SELECT * FROM [ecommerceDb1].[dbo].[Supplier] ORDER BY Id OFFSET ${offset} ROWS FETCH NEXT ${next} ROWS ONLY`)
        return response.status(200).json({message:"fetched requested data successfully", response:a})
    }
    else if(fieldname && columnname){
        let filteredData = await (await connect).query(`SELECT * FROM [ecommerceDb1].[dbo].[Supplier] WHERE [${columnname}] LIKE '%${fieldname}%'`)
        console.log(filteredData)
        return response.status(200).json({message:"fetched requested data successfully", response:filteredData})
    }
    else if((fieldname && !columnname) || (!fieldname && columnname)){
        return response.status(404).json({message:"you have provided either one of column name or fieldname please refiry and provide the details."})
    }
    //get all method
    else if(!offset && !next){
        let a = await (await connect).query(`SELECT * FROM [ecommerceDb1].[dbo].[Supplier]`)
        return response.status(200).json({message:"fetched requested data successfully", response:a})
    }
    else if (!offset || !next){
        return response.status(404).json({message:" you might have provided only one value instead of two. Please provide offset as well as next values"})
    }
    else{return response.status(404).json({message:"please choose between the respected values"})}
}


//get one
export const getOneSupplier = async(request:Request, response:Response) =>{

    let id = request.params.id
    let a = await (await connect).query(`select * from [ecommerceDb1].[dbo].[Supplier] where Id =${id}`)
    if (a[0]){
        return response.status(200).json({message:"Required details have been fetched successfully", response: a})
    }
    else{
        return response.status(404).json({message:"Invalid ID number, Please search with a valid ID number"})
    }
}

//insert a record
export const insertIntoSupplier = async (request: Request, response: Response)=>{

    const newSupplier = {
            CompanyName: request.body.companyname,
            ContactName: request.body.contactname,
            ContactTitle: request.body.contacttitle,
            City: request.body.city,
            Country: request.body.country,
            Phone: request.body.phone,
            Fax: request.body.fax
        }
        if(newSupplier.CompanyName){
            let a = await (await connect).query(`insert into [ecommerceDb1].[dbo].[Supplier] ([CompanyName], [ContactName], 
            [ContactTitle], [City], [Country], [Phone], [Fax]) values('${newSupplier.CompanyName}',
            '${newSupplier.ContactName}','${newSupplier.ContactTitle}', '${newSupplier.City}','${newSupplier.Country}','${newSupplier.Phone}',
            '${newSupplier.Fax}')`)

            let newSupp = await (await connect).query(`select *  from [Supplier] where CompanyName='${newSupplier.CompanyName}' 
            and ContactName = '${newSupplier.ContactName}'  
            and ContactTitle='${newSupplier.ContactTitle}' and City='${newSupplier.City}' and Country ='${newSupplier.Country}' 
            and Phone='${newSupplier.Phone}'
            and Fax='${newSupplier.Fax}'`)

            return response.status(200).json({message:"Required details has been inserted successfully", response: newSupp})
        }
        else{
            return response.status(404).json({message:"Please enter the company name which is mandatory!"})
        }

}


//update a record
export const updateAsupplier = async(request:Request, response:Response)=>{

    let id = request.params.id;
    let result = await(await connect).query(`select top (1) * from [ecommerceDb1].[dbo].[Supplier] where Id=${id}`);
    if (!result[0]){
        return response.status(404).json({message:"please enter a valid id number"})
    }
    else{
        let CompanyName=request.body.CompanyName?request.body.CompanyName:result[0].CompanyName;
        let ContactName = request.body.ContactName?request.body.ContactName:result[0].ContactName;
        let ContactTitle = request.body.ContactTitle?request.body.ContactTitle:result[0].ContactTitle;
        let City = request.body.City?request.body.City:result[0].City;
        let Country= request.body.Country?request.body.Country:result[0].Country;
        let Phone = request.body.Phone?request.body.Phone:result[0].Phone;
        let Fax = request.body.Fax?request.body.Fax:result[0].Fax;
        let query_response = await(await connect).query(`update [ecommerceDb1].[dbo].[Supplier] set CompanyName='${CompanyName}',
        ContactName='${ContactName}',
        ContactTitle='${ContactTitle}',City='${City}',Country='${Country}',Phone='${Phone}',Fax='${Fax}'`);
        let updated_data = await(await connect).query(`select * from [ecommerceDb1].[dbo].[Supplier] where id=${id}`);
        return response.status(200).json({message:"We have successfully updated the record",updated_data:updated_data})
    }
}

//delete a customer

export const deleteASupplier = async(request: Request, response: Response) =>{

    let id = request.params.id;
    let result = await (await connect).query(`select * from [ecommerceDb1].[dbo].[Supplier] where Id=${id}`);
    if (result[0]){
        let deletedColumn = await (await connect).query(`DELETE FROM [ecommerceDb1].[dbo].[Supplier] WHERE Id = ${id}`);
        return response.status(200).json({message: 'post deleted successfully', response: deletedColumn})
    }
    else{
        return response.status(404).json({message:" Please enter a valid id number "})
    }
}
