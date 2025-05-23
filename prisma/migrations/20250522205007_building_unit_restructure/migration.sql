/*
  Warnings:

  - You are about to drop the column `country` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `propertyId` on the `Building` table. All the data in the column will be lost.
  - Added the required column `province` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressId` to the `Building` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Building` table without a default value. This is not possible if the table is not empty.
  - Made the column `identifier` on table `Unit` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Building" DROP CONSTRAINT "Building_propertyId_fkey";

-- DropIndex
DROP INDEX "Building_propertyId_key";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "country",
DROP COLUMN "district",
DROP COLUMN "state",
ADD COLUMN     "province" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Building" DROP COLUMN "propertyId",
ADD COLUMN     "addressId" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "floors" INTEGER,
ADD COLUMN     "lat" DECIMAL(9,6),
ADD COLUMN     "lng" DECIMAL(9,6),
ADD COLUMN     "totalUnits" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "yearBuilt" INTEGER;

-- AlterTable
ALTER TABLE "Unit" ADD COLUMN     "position" TEXT,
ALTER COLUMN "identifier" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Building" ADD CONSTRAINT "Building_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
