import {Router} from 'express';
import { verifyToken } from '../utils/verifyToken.js';
import {AuthController, type IAuthController}from "../controllers/auth.controller.js"

const {register,login,authCheck,logout}:IAuthController = new AuthController
const route:Router = Router();

route.post("/register",register)
route.post("/login",login)
route.get("/me", verifyToken, authCheck)
route.post("/logout",logout)

export default route;