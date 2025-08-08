-- CreateTable
CREATE TABLE "Peserta" (
    "id" SERIAL NOT NULL,
    "nik" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "departemen" TEXT,

    CONSTRAINT "Peserta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hadiah" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "no_urut" INTEGER NOT NULL,
    "pemenang" INTEGER,

    CONSTRAINT "Hadiah_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Peserta_nik_key" ON "Peserta"("nik");
