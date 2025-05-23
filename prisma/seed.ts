import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
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

  // Address para propiedad
  const propertyAddress = await prisma.address.create({
    data: {
      street: 'Calle Falsa',
      number: '123',
      city: 'Ciudad',
      province: 'Provincia',
      postalCode: '12345',
      extraInfo: 'Apto 1'
    }
  });

  // Address para edificio
  const buildingAddress = await prisma.address.create({
    data: {
      street: 'Avenida Principal',
      number: '500',
      city: 'Ciudad',
      province: 'Provincia',
      postalCode: '12345',
      extraInfo: 'Edificio Residencial'
    }
  });

  // Usuario
  const user = await prisma.user.create({
    data: {
      email: 'admin@demo.com',
      password: bcrypt.hashSync('password', 8), // Hasheado
      fullName: 'Admin Demo',
      phone: '555-1234',
      roles: {
        create: [{ roleId: adminRole.id }]
      }
    }
  });

  // Propiedad independiente (casa)
  const houseProperty = await prisma.property.create({
    data: {
      title: 'Casa en el centro',
      description: 'Muy bien ubicada',
      listingTypeId: saleType.id,
      statusId: availableStatus.id,
      propertyTypeId: houseType.id,
      price: 200000,
      currency: 'USD',
      addressId: propertyAddress.id,
      agentId: user.id,
      coveredAreaM2: 120,
      totalAreaM2: 200,
      bedrooms: 3,
      bathrooms: 2,
      floors: 2,
      yearBuilt: 2005,
      garages: 2
    }
  });

  // Edificio
  const building = await prisma.building.create({
    data: {
      name: 'Edificio Residencial Torres',
      addressId: buildingAddress.id,
      floors: 5,
      totalUnits: 10,
      yearBuilt: 2015,
      lat: 40.712776,
      lng: -74.005974
    }
  });

  // Propiedad para unidad
  const apartmentProperty = await prisma.property.create({
    data: {
      title: 'Departamento en Torres',
      description: 'Lindo departamento en edificio moderno',
      listingTypeId: rentType.id,
      statusId: availableStatus.id,
      propertyTypeId: apartmentType.id,
      price: 1200,
      currency: 'USD',
      addressId: buildingAddress.id, // Usa la misma dirección del edificio
      agentId: user.id,
      coveredAreaM2: 75,
      totalAreaM2: 75,
      bedrooms: 2,
      bathrooms: 1,
      yearBuilt: 2015,
      garages: 1
    }
  });

  // Relación UserOnProperty (el usuario es propietario de la propiedad casa)
  await prisma.userOnProperty.create({
    data: {
      userId: user.id,
      propertyId: houseProperty.id,
      actorRoleId: ownerActorRole.id
    }
  });

  // Relación UserOnProperty (el usuario es dueño del departamento)
  await prisma.userOnProperty.create({
    data: {
      userId: user.id,
      propertyId: apartmentProperty.id,
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