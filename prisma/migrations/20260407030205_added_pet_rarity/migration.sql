/*
  Warnings:

  - You are about to drop the column `device` on the `player_account` table. All the data in the column will be lost.
  - Added the required column `rarity` to the `pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountDeviceId` to the `player_account` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PETRARITY" AS ENUM ('LEGENDARY', 'ULTRA_RARE', 'RARE', 'UNCOMMON', 'COMMON');

-- AlterTable
ALTER TABLE "pet" ADD COLUMN     "age" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "rarity" "PETRARITY" NOT NULL;

-- AlterTable
ALTER TABLE "player_account" DROP COLUMN "device",
ADD COLUMN     "accountDeviceId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "AccountDevice" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountDevice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "player_account" ADD CONSTRAINT "player_account_accountDeviceId_fkey" FOREIGN KEY ("accountDeviceId") REFERENCES "AccountDevice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
