import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL || "postgresql://faden_user:faden_password@localhost:55433/faden_db?schema=public";
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seed...");

  // Clean existing data
  await prisma.project.deleteMany();
  await prisma.section.deleteMany();
  await prisma.service.deleteMany();
  await prisma.client.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.gallery.deleteMany();

  // 1. Create Services & Sections
  const generalContracting = await prisma.service.create({
    data: {
      id: "srv_general_contracting",
      name: "General Contracting",
      slug: "general-contracting",
      description: "Comprehensive construction and contracting services for commercial and residential developments.",
      updatedAt: new Date(),
      sections: {
        create: [
          {
            id: "sec_overview_1",
            title: "Overview & Construction Capabilities",
            subtitle: "Turnkey EPC Solutions",
            type: "OVERVIEW",
            content: { text: "We deliver full-scale contracting services from ground excavation to final structural completion." },
            img: "/uploads/sections/overview1.jpg",
            order: 1,
          },
        ],
      },
    },
  });

  const infrastructure = await prisma.service.create({
    data: {
      id: "srv_infrastructure",
      name: "Infrastructure & Earthworks",
      slug: "infrastructure-earthworks",
      description: "Large scale civil engineering, excavation, roadworks, and foundational infrastructure.",
      updatedAt: new Date(),
      sections: {
        create: [
          {
            id: "sec_infra_1",
            title: "Infrastructure Capabilities",
            subtitle: "Earthworks & Roads",
            type: "OVERVIEW",
            content: { text: "State-of-the-art heavy machinery fleet for complex civil earthworks." },
            img: "/uploads/sections/infra1.jpg",
            order: 1,
          },
        ],
      },
    },
  });

  // 2. Create Clients
  await prisma.client.createMany({
    data: [
      {
        id: "cli_aramco",
        name: "Saudi Aramco",
        logo: "/uploads/clients/aramco.png",
        websiteUrl: "https://www.aramco.com",
        category: "Energy & Industrial",
        order: 1,
        updatedAt: new Date(),
      },
      {
        id: "cli_redsea",
        name: "Red Sea Global",
        logo: "/uploads/clients/redsea.png",
        websiteUrl: "https://www.redseaglobal.com",
        category: "Real Estate & Tourism",
        order: 2,
        updatedAt: new Date(),
      },
    ],
  });

  // 3. Create Equipment
  await prisma.equipment.createMany({
    data: [
      {
        id: "eq_cat_excavator",
        name: "CAT 349 Excavator",
        count: 12,
        img: "/uploads/equipment/cat349.jpg",
        category: "Heavy Equipment",
        order: 1,
        updatedAt: new Date(),
      },
      {
        id: "eq_tower_crane",
        name: "Liebherr 280 EC-H Tower Crane",
        count: 6,
        img: "/uploads/equipment/crane.jpg",
        category: "Lifting Equipment",
        order: 2,
        updatedAt: new Date(),
      },
    ],
  });

  // 4. Create Gallery Items
  await prisma.gallery.createMany({
    data: [
      {
        id: "gal_site_1",
        title: "Riyadh Tower Site Progress",
        description: "Foundation and core structural concrete pouring phase",
        img: "/uploads/gallery/site1.jpg",
        order: 1,
        updatedAt: new Date(),
      },
      {
        id: "gal_fleet_1",
        title: "Faden Equipment Fleet",
        description: "Heavy machinery array on excavation site",
        img: "/uploads/gallery/fleet1.jpg",
        order: 2,
        updatedAt: new Date(),
      },
    ],
  });

  // 5. Create Projects
  await prisma.project.create({
    data: {
      id: "prj_riyadh_tower",
      title: "Riyadh Financial Tower",
      slug: "riyadh-financial-tower",
      img: "/uploads/projects/riyadh_tower_main.jpg",
      serviceId: generalContracting.id,
      client: "Ministry of Housing",
      consultant: "Dar Al-Handasah",
      description: "A 35-story modern commercial skyscraper located in the heart of Riyadh.",
      duration: "24 Months",
      floors: "35 Floors",
      foundationDepth: "18 meters",
      location: "Riyadh, KSA",
      owner: "Faden Real Estate",
      partnershipType: "Joint Venture",
      projectType: "Commercial Skyscraper",
      scope: "Turnkey EPC Contracting",
      status: "Completed",
      structuralType: "Reinforced Concrete Core",
      totalArea: "45,000 sqm",
      highlights: ["Post-tensioned slabs", "LEED Gold certified structure"],
      images: ["/uploads/projects/riyadh_tower_1.jpg", "/uploads/projects/riyadh_tower_2.jpg"],
      keyAchievements: ["Completed 2 months ahead of schedule", "Zero LTI safety milestone"],
      technicalSpecs: { concreteGrade: "C60", steelTonnage: "4500 Tons" },
      updatedAt: new Date(),
    },
  });

  await prisma.project.create({
    data: {
      id: "prj_highway_expansion",
      title: "Southern Highway Expansion",
      slug: "southern-highway-expansion",
      img: "/uploads/projects/highway_main.jpg",
      serviceId: infrastructure.id,
      client: "Ministry of Transport",
      consultant: "Khatib & Alami",
      description: "120km highway expansion including bridges, underpasses, and civil earthworks.",
      duration: "36 Months",
      location: "Jeddah - Makkah, KSA",
      owner: "Ministry of Transport",
      partnershipType: "Main Contractor",
      projectType: "Infrastructure & Highway",
      scope: "Civil & Earthworks",
      status: "In Progress",
      totalArea: "120 km",
      highlights: ["High-durability asphalt paving", "Grade-separated interchanges"],
      images: ["/uploads/projects/highway_1.jpg"],
      keyAchievements: ["50km opened for early traffic"],
      updatedAt: new Date(),
    },
  });

  console.log("✅ Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });