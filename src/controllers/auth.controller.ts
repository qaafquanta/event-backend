import type { NextFunction, Request,Response } from "express";
import prisma from "../prisma.js"
import { hashPassword } from "../utils/hashPassword.js";
import {compare} from 'bcrypt'
import {createToken} from "../utils/createToken.js"

export const register = async (req:Request,res:Response)=>{
    try{
        //code
        const regis = await prisma.user.create({
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

export const login = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        //code
        const account :{username:string,email:string,id:number,password?:string|undefined}|null= await prisma.accounts.findUnique({
            where:req.body,
            omit:{
                password:true
            }
        })

        if(!account){
            throw { code:404,message:"account not found"}
        }

        const comparePassword = await compare(req.body.password,user?.password);
        if(!comparePassword){
            throw {code:401,messagte:"wrong password"}
        }

        res.status(200).send({
            success:true,
            result: {
                email: account.email,
                username:account.username,
                token: createToken({id:account.id})
            }
        })
    }catch(error){
        next(error)
    }
}