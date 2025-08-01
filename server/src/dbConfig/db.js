// import { PrismaClient } from '@prisma/client'

// const prisma = new PrismaClient(
//     {
//         log: ['query', 'info', 'warn', 'error'],
//     }
// )

// async function main() {
//   // ... you will write your Prisma Client queries here
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   });

//   export default prisma


// prisma.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

export default prisma
