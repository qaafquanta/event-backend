import {Router} from 'express';
import {AuthController, type IAuthController}from "../controllers/auth.controller.js"

const {register,login}:IAuthController = new AuthController
const route:Router = Router();

route.post("/register",register)
route.post("/login",login)

export default route;