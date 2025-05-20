import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Roles
  const adminRole = await prisma.role.create({
    data: { code: 'ADMIN', description: 'Administrador' }
  });
  const agentRole = await prisma.role.create({
    data: { code: 'AGENT', description: 'Agente inmobiliario' }
  });

  // Property Actor Roles
  const ownerActorRole = await prisma.propertyActorRole.create({
    data: { code: 'OWNER', description: 'Propietario' }
  });
  const tenantActorRole = await prisma.propertyActorRole.create({
    data: { code: 'TENANT', description: 'Inquilino' }
  });

  // Property Status
  const availableStatus = await prisma.propertyStatus.create({
    data: { code: 'AVAILABLE', description: 'Disponible' }
  });
  const soldStatus = await prisma.propertyStatus.create({
    data: { code: 'SOLD', description: 'Vendido' }
  });

  // Listing Type
  const saleType = await prisma.listingType.create({
    data: { code: 'SALE', description: 'Venta' }
  });
  const rentType = await prisma.listingType.create({
    data: { code: 'RENT', description: 'Renta' }
  });

  // Property Type
  const apartmentType = await prisma.propertyType.create({
    data: { code: 'APARTMENT', description: 'Departamento' }
  });
  const houseType = await prisma.propertyType.create({
    data: { code: 'HOUSE', description: 'Casa' }
  });

  // Address
  const address = await prisma.address.create({
    data: {
      street: 'Calle Falsa',
      number: '123',
      city: 'Ciudad',
      state: 'Estado',
      country: 'País',
      district: 'Centro',
      postalCode: '12345',
      extraInfo: 'Apto 1'
    }
  });

  // Usuario
  const user = await prisma.user.create({
    data: {
      email: 'admin@demo.com',
      password: '123456', // Recuerda hashear en producción
      fullName: 'Admin Demo',
      phone: '555-1234',
      roles: {
        create: [{ roleId: adminRole.id }]
      }
    }
  });

  // Propiedad
  const property = await prisma.property.create({
    data: {
      title: 'Departamento en el centro',
      description: 'Muy bien ubicado',
      listingTypeId: saleType.id,
      statusId: availableStatus.id,
      propertyTypeId: apartmentType.id,
      price: 100000,
      currency: 'USD',
      addressId: address.id,
      agentId: user.id,
      coveredAreaM2: 80,
      totalAreaM2: 100,
      bedrooms: 2,
      bathrooms: 1,
      floors: 1,
      yearBuilt: 2010,
      garages: 1
    }
  });

  // Relación UserOnProperty (el usuario es propietario de la propiedad)
  await prisma.userOnProperty.create({
    data: {
      userId: user.id,
      propertyId: property.id,
      actorRoleId: ownerActorRole.id
    }
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 