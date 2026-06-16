import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { generateSearchKey } from "../src/lib/utils/searchKey"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  const customers = await prisma.customer.findMany({
    where: { searchKey: null },
    include: {
      vehicles: {
        orderBy: { createdAt: "asc" },
        take: 1,
      },
    },
  })

  console.log(`Found ${customers.length} customers without searchKey`)

  let updated = 0
  for (const customer of customers) {
    if (customer.vehicles.length === 0) {
      console.log(`  Skipping customer "${customer.name}" (${customer.id}) — no vehicles`)
      continue
    }

    const vehicle = customer.vehicles[0]
    const searchKey = generateSearchKey(customer.name, vehicle.plate)

    await prisma.customer.update({
      where: { id: customer.id },
      data: { searchKey },
    })

    console.log(`  Updated "${customer.name}" → searchKey: ${searchKey} (plate: ${vehicle.plate})`)
    updated++
  }

  console.log(`\nDone! ${updated} customers updated.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
