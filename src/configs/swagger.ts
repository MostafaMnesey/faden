export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Faden Contracting API Documentation",
    version: "1.0.0",
    description:
      "Complete API Documentation for Faden Contracting Backend Services (Dashboard Admin & Public Website APIs)",
  },
  servers: [
    {
      url: "http://localhost:3011",
      description: "Local Server",
    },
  ],
  tags: [
    { name: "System", description: "System status and health check endpoints" },
    { name: "Dashboard - Services", description: "Admin CRUD operations for main Services" },
    { name: "Dashboard - Service Sections", description: "Admin management of Service content sections" },
    { name: "Dashboard - Service Projects", description: "Admin management of projects attached to specific services" },
    { name: "Dashboard - Clients", description: "Admin CRUD operations for Clients" },
    { name: "Dashboard - Equipment", description: "Admin CRUD operations for Equipment" },
    { name: "Dashboard - Gallery", description: "Admin CRUD operations for Gallery items" },
    { name: "Dashboard - Projects", description: "Admin CRUD operations for main Projects" },
    { name: "Public Website - Services", description: "Public APIs for viewing Services" },
    { name: "Public Website - Clients", description: "Public APIs for viewing Clients" },
    { name: "Public Website - Equipment", description: "Public APIs for viewing Equipment" },
    { name: "Public Website - Gallery", description: "Public APIs for viewing Gallery items" },
    { name: "Public Website - Projects", description: "Public APIs for viewing Projects & filtering" },
  ],
  paths: {
    "/test": {
      get: {
        summary: "Health Check",
        tags: ["System"],
        responses: {
          "200": {
            description: "System is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "OK" },
                  },
                },
              },
            },
          },
        },
      },
    },

    // ─── Dashboard Services ──────────────────────────────────────────────────
    "/dashboard/service": {
      post: {
        summary: "Create Service (Admin)",
        tags: ["Dashboard - Services"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: { type: "string", example: "General Contracting" },
                  slug: { type: "string", example: "general-contracting" },
                  description: { type: "string", example: "Comprehensive construction and contracting services" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Service Created Successfully" },
          "400": { description: "Validation Error" },
        },
      },
      get: {
        summary: "Get All Services Paginated (Admin)",
        tags: ["Dashboard - Services"],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
        ],
        responses: {
          "200": { description: "Services fetched successfully" },
        },
      },
    },
    "/dashboard/service/{id}": {
      get: {
        summary: "Get Service by ID (Admin)",
        tags: ["Dashboard - Services"],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Service details fetched successfully" },
          "404": { description: "Service Not Found" },
        },
      },
      put: {
        summary: "Update Service (Admin)",
        tags: ["Dashboard - Services"],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  slug: { type: "string" },
                  description: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Service Updated Successfully" },
          "404": { description: "Service Not Found" },
        },
      },
      delete: {
        summary: "Delete Service (Admin)",
        tags: ["Dashboard - Services"],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Service Deleted Successfully" },
          "404": { description: "Service Not Found" },
        },
      },
    },

    // ─── Dashboard Service Sections ──────────────────────────────────────────
    "/dashboard/service/{id}/sections": {
      post: {
        summary: "Add Section to Service (Admin)",
        tags: ["Dashboard - Service Sections"],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Service ID" },
        ],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["title", "type", "content"],
                properties: {
                  title: { type: "string", example: "Overview & Features" },
                  subtitle: { type: "string", example: "Key highlights of our service" },
                  type: { type: "string", enum: ["OVERVIEW", "BULLETS", "STEPS"], example: "OVERVIEW" },
                  content: { type: "string", description: "JSON stringified content or structured text" },
                  order: { type: "integer", default: 0 },
                  img: { type: "string", format: "binary", description: "Section image file" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Section Added Successfully" },
          "404": { description: "Service Not Found" },
        },
      },
    },
    "/dashboard/service/sections/{sectionId}": {
      put: {
        summary: "Update Section (Admin)",
        tags: ["Dashboard - Service Sections"],
        parameters: [
          { name: "sectionId", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  subtitle: { type: "string" },
                  type: { type: "string", enum: ["OVERVIEW", "BULLETS", "STEPS"] },
                  content: { type: "string" },
                  order: { type: "integer" },
                  img: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Section Updated Successfully" },
          "404": { description: "Section Not Found" },
        },
      },
      delete: {
        summary: "Delete Section (Admin)",
        tags: ["Dashboard - Service Sections"],
        parameters: [
          { name: "sectionId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Section Deleted Successfully" },
          "404": { description: "Section Not Found" },
        },
      },
    },

    // ─── Dashboard Service Projects ──────────────────────────────────────────
    "/dashboard/service/{id}/projects": {
      post: {
        summary: "Add Project to Service (Admin)",
        tags: ["Dashboard - Service Projects"],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Service ID" },
        ],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["title", "img"],
                properties: {
                  title: { type: "string", example: "Tower Construction Project" },
                  img: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Project Added to Service" },
          "404": { description: "Service Not Found" },
        },
      },
    },
    "/dashboard/service/projects/{projectId}": {
      put: {
        summary: "Update Service Project (Admin)",
        tags: ["Dashboard - Service Projects"],
        parameters: [
          { name: "projectId", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  img: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Project Updated" },
          "404": { description: "Project Not Found" },
        },
      },
      delete: {
        summary: "Delete Service Project (Admin)",
        tags: ["Dashboard - Service Projects"],
        parameters: [
          { name: "projectId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Project Deleted" },
          "404": { description: "Project Not Found" },
        },
      },
    },

    // ─── Dashboard Clients ───────────────────────────────────────────────────
    "/dashboard/client": {
      post: {
        summary: "Create Client (Admin)",
        tags: ["Dashboard - Clients"],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: { type: "string", example: "Aramco Contracting" },
                  websiteUrl: { type: "string", example: "https://example.com" },
                  category: { type: "string", example: "Government" },
                  order: { type: "integer", default: 0 },
                  logo: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Client Created Successfully" },
        },
      },
      get: {
        summary: "Get All Clients (Admin)",
        tags: ["Dashboard - Clients"],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          { name: "category", in: "query", schema: { type: "string" } },
          { name: "search", in: "query", schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Clients fetched successfully" },
        },
      },
    },
    "/dashboard/client/{id}": {
      get: {
        summary: "Get Client by ID (Admin)",
        tags: ["Dashboard - Clients"],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Client details fetched" },
          "404": { description: "Client Not Found" },
        },
      },
      put: {
        summary: "Update Client (Admin)",
        tags: ["Dashboard - Clients"],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  websiteUrl: { type: "string" },
                  category: { type: "string" },
                  order: { type: "integer" },
                  logo: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Client Updated Successfully" },
          "404": { description: "Client Not Found" },
        },
      },
      delete: {
        summary: "Delete Client (Admin)",
        tags: ["Dashboard - Clients"],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Client Deleted Successfully" },
          "404": { description: "Client Not Found" },
        },
      },
    },

    // ─── Dashboard Equipment ─────────────────────────────────────────────────
    "/dashboard/equipment": {
      post: {
        summary: "Create Equipment (Admin)",
        tags: ["Dashboard - Equipment"],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: { type: "string", example: "Heavy Excavator CAT 349" },
                  count: { type: "integer", default: 1 },
                  category: { type: "string", example: "Earthmoving" },
                  order: { type: "integer", default: 0 },
                  img: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Equipment Created Successfully" },
        },
      },
      get: {
        summary: "Get All Equipment (Admin)",
        tags: ["Dashboard - Equipment"],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          { name: "category", in: "query", schema: { type: "string" } },
          { name: "search", in: "query", schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Equipment list fetched successfully" },
        },
      },
    },
    "/dashboard/equipment/{id}": {
      get: {
        summary: "Get Equipment by ID (Admin)",
        tags: ["Dashboard - Equipment"],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Equipment details fetched" },
          "404": { description: "Equipment Not Found" },
        },
      },
      put: {
        summary: "Update Equipment (Admin)",
        tags: ["Dashboard - Equipment"],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  count: { type: "integer" },
                  category: { type: "string" },
                  order: { type: "integer" },
                  img: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Equipment Updated Successfully" },
          "404": { description: "Equipment Not Found" },
        },
      },
      delete: {
        summary: "Delete Equipment (Admin)",
        tags: ["Dashboard - Equipment"],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Equipment Deleted Successfully" },
          "404": { description: "Equipment Not Found" },
        },
      },
    },

    // ─── Dashboard Gallery ───────────────────────────────────────────────────
    "/dashboard/gallery": {
      post: {
        summary: "Create Gallery Item (Admin)",
        tags: ["Dashboard - Gallery"],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["img"],
                properties: {
                  title: { type: "string", example: "Modern Villa Structural Frame" },
                  description: { type: "string", example: "Construction site progress shot" },
                  order: { type: "integer", default: 0 },
                  img: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Gallery Item Created" },
        },
      },
      get: {
        summary: "Get All Gallery Items (Admin)",
        tags: ["Dashboard - Gallery"],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
        ],
        responses: {
          "200": { description: "Gallery items fetched successfully" },
        },
      },
    },
    "/dashboard/gallery/{id}": {
      get: {
        summary: "Get Gallery Item by ID (Admin)",
        tags: ["Dashboard - Gallery"],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Gallery item details fetched" },
          "404": { description: "Gallery Item Not Found" },
        },
      },
      patch: {
        summary: "Update Gallery Item (Admin)",
        tags: ["Dashboard - Gallery"],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  order: { type: "integer" },
                  img: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Gallery Item Updated" },
          "404": { description: "Gallery Item Not Found" },
        },
      },
      delete: {
        summary: "Delete Gallery Item (Admin)",
        tags: ["Dashboard - Gallery"],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Gallery Item Deleted" },
          "404": { description: "Gallery Item Not Found" },
        },
      },
    },

    // ─── Dashboard Main Projects ─────────────────────────────────────────────
    "/dashboard/project": {
      post: {
        summary: "Create Main Project (Admin)",
        tags: ["Dashboard - Projects"],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["title", "serviceId"],
                properties: {
                  title: { type: "string", example: "Riyadh Financial Tower" },
                  slug: { type: "string", example: "riyadh-financial-tower" },
                  location: { type: "string", example: "Riyadh, KSA" },
                  description: { type: "string", example: "Modern commercial skyscraper project" },
                  client: { type: "string", example: "Ministry of Housing" },
                  projectType: { type: "string", example: "Commercial Skyscraper" },
                  owner: { type: "string", example: "Faden Real Estate" },
                  consultant: { type: "string", example: "Dar Al-Handasah" },
                  scope: { type: "string", example: "Turnkey EPC Contracting" },
                  partnershipType: { type: "string", example: "Joint Venture" },
                  totalArea: { type: "string", example: "45,000 sqm" },
                  floors: { type: "string", example: "35 Floors" },
                  structuralType: { type: "string", example: "Reinforced Concrete Core" },
                  foundationDepth: { type: "string", example: "18 meters" },
                  structuralDetails: { type: "string", example: "Post-tensioned slabs" },
                  duration: { type: "string", example: "24 Months" },
                  status: { type: "string", example: "Completed" },
                  technicalSpecs: { type: "string", description: "JSON stringified technical specifications object" },
                  highlightTitle: { type: "string" },
                  highlightDescription: { type: "string" },
                  highlights: { type: "string", description: "Comma-separated or JSON array of strings" },
                  keyAchievements: { type: "string", description: "Comma-separated or JSON array of strings" },
                  order: { type: "integer", default: 0 },
                  serviceId: { type: "string", description: "ID of the associated Service" },
                  img: { type: "string", format: "binary", description: "Main project image" },
                  highlightImg: { type: "string", format: "binary", description: "Highlight section image" },
                  images: {
                    type: "array",
                    items: { type: "string", format: "binary" },
                    description: "Project gallery images (up to 10 files)",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Project Created Successfully" },
        },
      },
      get: {
        summary: "Get All Projects (Admin)",
        tags: ["Dashboard - Projects"],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          { name: "serviceId", in: "query", schema: { type: "string" } },
          { name: "partnershipType", in: "query", schema: { type: "string" } },
          { name: "search", in: "query", schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Projects list fetched successfully" },
        },
      },
    },
    "/dashboard/project/{id}": {
      get: {
        summary: "Get Project by ID (Admin)",
        tags: ["Dashboard - Projects"],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Project details fetched" },
          "404": { description: "Project Not Found" },
        },
      },
      put: {
        summary: "Update Main Project (Admin)",
        tags: ["Dashboard - Projects"],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  slug: { type: "string" },
                  location: { type: "string" },
                  description: { type: "string" },
                  client: { type: "string" },
                  projectType: { type: "string" },
                  owner: { type: "string" },
                  consultant: { type: "string" },
                  scope: { type: "string" },
                  partnershipType: { type: "string" },
                  totalArea: { type: "string" },
                  floors: { type: "string" },
                  structuralType: { type: "string" },
                  foundationDepth: { type: "string" },
                  structuralDetails: { type: "string" },
                  duration: { type: "string" },
                  status: { type: "string" },
                  technicalSpecs: { type: "string" },
                  highlightTitle: { type: "string" },
                  highlightDescription: { type: "string" },
                  highlights: { type: "string" },
                  keyAchievements: { type: "string" },
                  order: { type: "integer" },
                  serviceId: { type: "string" },
                  img: { type: "string", format: "binary" },
                  highlightImg: { type: "string", format: "binary" },
                  images: {
                    type: "array",
                    items: { type: "string", format: "binary" },
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Project Updated Successfully" },
          "404": { description: "Project Not Found" },
        },
      },
      delete: {
        summary: "Delete Project (Admin)",
        tags: ["Dashboard - Projects"],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Project Deleted Successfully" },
          "404": { description: "Project Not Found" },
        },
      },
    },

    // ─── Public Website Services ──────────────────────────────────────────────
    "/website/service": {
      get: {
        summary: "Get Public Services (Website)",
        tags: ["Public Website - Services"],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
        ],
        responses: {
          "200": { description: "Public services fetched successfully" },
        },
      },
    },
    "/website/service/{slug}": {
      get: {
        summary: "Get Public Service by Slug (Website)",
        tags: ["Public Website - Services"],
        parameters: [
          { name: "slug", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Public service details fetched" },
          "404": { description: "Service Not Found" },
        },
      },
    },

    // ─── Public Website Clients ───────────────────────────────────────────────
    "/website/client": {
      get: {
        summary: "Get Public Clients (Website)",
        tags: ["Public Website - Clients"],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          { name: "category", in: "query", schema: { type: "string" } },
          { name: "search", in: "query", schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Public client list fetched" },
        },
      },
    },
    "/website/client/{id}": {
      get: {
        summary: "Get Public Client by ID (Website)",
        tags: ["Public Website - Clients"],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Client details fetched" },
          "404": { description: "Client Not Found" },
        },
      },
    },

    // ─── Public Website Equipment ─────────────────────────────────────────────
    "/website/equipment": {
      get: {
        summary: "Get Public Equipment (Website)",
        tags: ["Public Website - Equipment"],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          { name: "category", in: "query", schema: { type: "string" } },
          { name: "search", in: "query", schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Public equipment list fetched" },
        },
      },
    },
    "/website/equipment/{id}": {
      get: {
        summary: "Get Public Equipment by ID (Website)",
        tags: ["Public Website - Equipment"],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Equipment details fetched" },
          "404": { description: "Equipment Not Found" },
        },
      },
    },

    // ─── Public Website Gallery ───────────────────────────────────────────────
    "/website/gallery": {
      get: {
        summary: "Get Public Gallery Items (Website)",
        tags: ["Public Website - Gallery"],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 9 } },
        ],
        responses: {
          "200": { description: "Public gallery list fetched" },
        },
      },
    },
    "/website/gallery/{id}": {
      get: {
        summary: "Get Public Gallery Item by ID (Website)",
        tags: ["Public Website - Gallery"],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Gallery item details fetched" },
          "404": { description: "Gallery Item Not Found" },
        },
      },
    },

    // ─── Public Website Projects ──────────────────────────────────────────────
    "/website/project": {
      get: {
        summary: "Get Public Projects (Website)",
        tags: ["Public Website - Projects"],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          { name: "serviceId", in: "query", schema: { type: "string" } },
          { name: "serviceIds", in: "query", schema: { type: "string" }, description: "Comma separated service IDs (e.g. id1,id2)" },
          { name: "partnershipType", in: "query", schema: { type: "string" } },
          { name: "hasImages", in: "query", schema: { type: "boolean" } },
          { name: "projectsWithoutImages", in: "query", schema: { type: "boolean" } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "sortBy", in: "query", schema: { type: "string", enum: ["default", "latest", "titleAsc", "titleDesc"] } },
        ],
        responses: {
          "200": { description: "Public project list fetched successfully" },
        },
      },
    },
    "/website/project/filters": {
      get: {
        summary: "Get Project Filter Metadata (Website)",
        tags: ["Public Website - Projects"],
        responses: {
          "200": {
            description: "Filter options (categories, services) fetched successfully",
          },
        },
      },
    },
    "/website/project/id/{id}": {
      get: {
        summary: "Get Public Project by ID (Website)",
        tags: ["Public Website - Projects"],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Public project details fetched" },
          "404": { description: "Project Not Found" },
        },
      },
    },
    "/website/project/{slug}": {
      get: {
        summary: "Get Public Project by Slug (Website)",
        tags: ["Public Website - Projects"],
        parameters: [
          { name: "slug", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Public project details fetched" },
          "404": { description: "Project Not Found" },
        },
      },
    },
  },
};
