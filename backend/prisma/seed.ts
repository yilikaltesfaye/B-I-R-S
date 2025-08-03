// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. Seed Categories (only required fields)
  const categories = await prisma.category.createMany({
    data: [
      { name: "Water Infrastructure", description: "Issues related to water systems" },
      { name: "Road Damage", description: "Potholes, cracks, or collapsed roads" },
      { name: "Electricity Outages", description: "Power failures or unsafe wiring" },
      { name: "Sewage Problems", description: "Blocked or overflowing sewage systems" },
      { name: "Public Safety", description: "Street lighting, guardrails, or signage issues" },
    ],
  });

  // 2. Seed Authority Offices (region = Sidama)
  const office1 = await prisma.authorityOffice.create({
    data: {
      officeName: "Sidama Water Authority",
      email: "water@sidama.gov.et",
      phone: "+251900000001",
      address: {
        region: "Sidama",
        zone: "",
        woreda: "",
        city: "",
        subCity: "",
        kebele: "",
      },
    },
  });

  const office2 = await prisma.authorityOffice.create({
    data: {
      officeName: "Sidama Road Authority",
      email: "roads@sidama.gov.et",
      phone: "+251900000002",
      address: {
        region: "Sidama",
        zone: "",
        woreda: "",
        city: "",
        subCity: "",
        kebele: "",
      },
    },
  });

  // 3. Connect All Categories to Sidama Offices
  const allCategories = await prisma.category.findMany();

  await prisma.authorityOffice.update({
    where: { id: office1.id },
    data: {
      categories: {
        connect: allCategories.map((c) => ({ id: c.id })),
      },
    },
  });

  await prisma.authorityOffice.update({
    where: { id: office2.id },
    data: {
      categories: {
        connect: allCategories.map((c) => ({ id: c.id })),
      },
    },
  });
}

main()
  .then(() => {
    console.log("✅ Seed completed successfully");
    return prisma.$disconnect();
  })
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    return prisma.$disconnect().finally(() => process.exit(1));
  });
