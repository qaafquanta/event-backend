import dotenv from "dotenv";
dotenv.config();
import cors from 'cors';
import cookieParser from "cookie-parser"
import type {Application, NextFunction, Request,Response} from 'express'
import express, {urlencoded, type Express} from 'express'
import authRouter from "./routes/auth.route.js"
import eventRouter from "./routes/event.route.js"

const PORT = process.env.PORT;

// export default class App {
//     private app: Express;

//     constructor(){
//         this.app = express();
//         this.configure();
//     }

//     private configure():void{
//         this.app.use(cors());
//         this.app.use(express.json());
//         // this.app.use(urlencoded({extended:true}));
//     }

//     public start():void{
//         this.app.listen(PORT,()=>{console.info("API RUNNING ON PORT",PORT)})
//     }
// }

//define app server
const app: Application = express();

//define app basic middleware
app.use(
  cors({
    origin: ["http://localhost:8099","http://localhost:3001"], // alamat frontend
    credentials: true, // penting agar cookie bisa dikirim
  })
);
app.use(express.json()) // for receive req.body
app.use(cookieParser())

//define app main router
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("<h1>ORM API</h1>");
});

app.use("/auth", authRouter);
app.use("/event", eventRouter);

//error middleware
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  res.status(error.code || 500).send(error);
});

//define other route
// app.get("/user",async (req:Request,res:Response)=>{
//     try {
//         const user = await prisma.user.findMany();

//         res.status(200).send(user)
//     } catch(error){
//         console.log(error)
//     }
// }
// )

//run app server
app.listen(PORT, () => {
  console.log("API RUNNING", PORT);
});
