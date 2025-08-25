/*
  Warnings:

  - You are about to drop the column `departement` on the `Peserta` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Peserta" DROP COLUMN "departement",
ADD COLUMN     "departement_id" INTEGER;

-- CreateTable
CREATE TABLE "Departement" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Departement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Peserta" ADD CONSTRAINT "Peserta_departement_id_fkey" FOREIGN KEY ("departement_id") REFERENCES "Departement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
