/*
  Warnings:

  - You are about to drop the column `addressId` on the `Building` table. All the data in the column will be lost.
  - You are about to drop the column `addressId` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Building" DROP CONSTRAINT "Building_addressId_fkey";

-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_addressId_fkey";

-- AlterTable
ALTER TABLE "Building" DROP COLUMN "addressId",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "number" TEXT,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "province" TEXT,
ADD COLUMN     "street" TEXT;

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "addressId",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "number" TEXT,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "province" TEXT,
ADD COLUMN     "street" TEXT;

-- DropTable
DROP TABLE "Address";
