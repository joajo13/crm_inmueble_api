/*
  Warnings:

  - You are about to drop the `Unit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Unit" DROP CONSTRAINT "Unit_buildingId_fkey";

-- DropForeignKey
ALTER TABLE "Unit" DROP CONSTRAINT "Unit_propertyId_fkey";

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "buildingId" INTEGER,
ALTER COLUMN "currency" SET DEFAULT 'ARS';

-- DropTable
DROP TABLE "Unit";

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("id") ON DELETE SET NULL ON UPDATE CASCADE;
