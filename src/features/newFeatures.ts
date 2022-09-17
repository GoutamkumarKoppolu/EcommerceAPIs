import {connect} from "../connection/connection"
import { Request, Response } from "express"

export const validateCustomer = async(request: Request, response: Response) =>{
    let phone = request.params.phone
    let isCusomer = await(await connect).query(`SELECT * FROM [ecommerceDb1].[dbo].[Customer] WHERE Phone = '${phone}' `)
    if (isCusomer[0]){
        return response.status(200).json({message:"The customer you are searching for is in the database", response: isCusomer})
    }
    else{
        return response.status(404).json({message:"Customer not found, Please enroll yourself"})
    }
}