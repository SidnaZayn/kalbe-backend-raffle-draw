import { Prisma, PrismaClient } from '@prisma/client'
import cors from 'cors'
import express from 'express'
import PesertaRoute from "./peserta/route";
import HadiahRoute from "./hadiah/route";

const prisma = new PrismaClient()
const app = express()

app.use(express.json())
app.use(cors())

app.use("/peserta", PesertaRoute)
app.use("/hadiah", HadiahRoute)


const server = app.listen(3000, () =>
  console.log(`🚀 Server ready at: http://localhost:3000`),
)
