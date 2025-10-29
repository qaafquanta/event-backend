import jwt from "jsonwebtoken"

interface IDataToken {
    id:string;
    role?:string;
}

const sign = jwt.sign
const secretKey = process.env.SECRET_KEY_TKN || "secret";

export const createToken = (data: IDataToken)=>{
    return sign(
        {
            id:data.id,
            role:data.role
        },
        secretKey,
        {
            expiresIn:"30d"
        }
    )
}