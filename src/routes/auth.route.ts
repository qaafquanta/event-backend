import {Router} from 'express';
import {login, register} from "../controllers/auth.controller.js"

const route:Router = Router();

route.post("/regis",register)
route.post("/login",login)

export default route;