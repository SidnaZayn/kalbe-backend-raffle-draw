import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.PesertaCreateInput[] = [
  {
    nama: 'John Doe',
    nik:'1000000001',
    status: false,
  },
  {
    nama: 'Jane Doe',
    nik:'1000000002',
    status: false,
  },
  {
    nama: 'Alice Smith',
    nik:'1000000003',
    status: false,
  },
  
]

async function main() {
  console.log(`Start seeding ...`)
  for (const u of userData) {
    const user = await prisma.peserta.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
