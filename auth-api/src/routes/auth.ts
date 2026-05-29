import {Router,Request,Response} from 'express'
import  jwt  from 'jsonwebtoken'
import { prisma } from '../prisma/client'
import bcrypt from 'bcrypt'
import { authenticate,authorize } from '../middleware/auth'
const router = Router()

router.post('/register',async(req:Request,res:Response) => {
    const {name,email,password} = req.body

    const existingUser = await prisma.user.findUnique({
        where:{email}
    })

    if(existingUser){
        return res.status(400).json({message:'Email already is use'})
    }


    const hashedPassword = await bcrypt.hash(password,10)

    const user = await prisma.user.create({
        data:{name,email,password:hashedPassword}
    })


    res.status(201).json({
        id:user.id,
        name:user.name,
        email:user.email,
        role:user.role
    })
})

router.post('/login',async(req:Request,res:Response) =>{
    const {email,password} = req.body

    const existingUser = await prisma.user.findUnique({
        where:{email:email}
    })

    if(!existingUser){
        return res.status(400).json({message:'Email incorrect'})
    }

    const isMatch = await bcrypt.compare(password,existingUser.password)
    if(!isMatch) return res.status(400).json({message:'password incorrect'});


    const token = jwt.sign(
        {id:existingUser.id,email:existingUser.email,role:existingUser.role},
        process.env.JWT_SECRET as string,
        {expiresIn : "7d"}
    )
    console.log("SIGNING WITH SECRET:", process.env.JWT_SECRET)
    
    return res.status(200).json({message:`Welcome back ${existingUser.name}`,token})
})


router.get('/profile',authenticate,(req:Request,res:Response) =>{
    res.json({message:'Protected route',user:req.user})
})

router.get("/admin", authenticate, authorize("admin"), (req, res) => {
  res.json({ message: "Welcome admin" })
})

export default router