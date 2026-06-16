import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  const ordens = await prisma.serviceOrder.findMany({
    include: { vehicle: { select: { customerId: true } } },
  })

  const inconsistent = ordens.filter((o) => o.customerId !== o.vehicle.customerId)

  if (inconsistent.length === 0) {
    console.log("No inconsistent records found. All service orders match their vehicle's customer.")
    return
  }

  console.log(`Found ${inconsistent.length} OS with mismatched customerId:\n`)

  for (const os of inconsistent) {
    console.log(`  OS #${os.number}`)
    console.log(`    OS.customerId:    ${os.customerId ?? "(null)"}`)
    console.log(`    Vehicle.customerId: ${os.vehicle.customerId}`)
    console.log()
  }

  console.log(`\nFixing ${inconsistent.length} records...`)

  let updated = 0
  for (const os of inconsistent) {
    await prisma.serviceOrder.update({
      where: { id: os.id },
      data: { customerId: os.vehicle.customerId },
    })
    updated++
  }

  console.log(`Done! ${updated} OS updated to match their vehicle's customer.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
