import type { NextFunction, Request,Response } from "express";
import prisma from "../prisma.js"
import { hashPassword } from "../utils/hashPassword.js";
import {compare} from 'bcrypt'
import {createToken} from "../utils/createToken.js"

export interface IAuthController {
    register(req: Request, res: Response,next:NextFunction): Promise<void>
    login(req: Request, res: Response,next:NextFunction): Promise<void>
}

export class AuthController implements IAuthController {

    async register(req:Request,res:Response){
    try{
        await prisma.user.create({
            data:{
                ...req.body,
                password: await hashPassword(req.body.password)
            }
        })
        res.status(200).send({
            message:"Registration Success",
            success: true
        })
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
    }

    async login(req:Request,res:Response,next:NextFunction){
    try{
        //code
        const account :{username:string,email:string,id:string,password?:string|undefined}|null= await prisma.user.findUnique({
            where:req.body,
            omit:{
                password:true
            }
        })

        if(!account){
            throw { code:404,message:"account not found"}
        }

        const comparePassword = await compare(req.body.password,req.body.user?.password);
        if(!comparePassword){
            throw {code:401,message:"wrong password"}
        }
        res.status(200).send({
            success:true,
            result: {
                email: account.email,
                username:account.username,
                token: createToken({id:Number(account.id)})
            }
        })
    }catch(error){
        next(error)
    }
    }
}