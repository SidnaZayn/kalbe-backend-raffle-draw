/*
  Warnings:

  - You are about to drop the column `departemen` on the `Peserta` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Peserta" DROP COLUMN "departemen",
ADD COLUMN     "departement" TEXT,
ADD COLUMN     "entity" TEXT,
ADD COLUMN     "location" TEXT;
