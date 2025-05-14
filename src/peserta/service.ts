import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getRandomPeserta = async () => {
  const peserta = await prisma.peserta.findMany({
    where: {
      status: false,
    },
    select: {
      nik: true,
      id: true,
    },
    orderBy: {
      id: "asc",
    },
  });
  const pesertaNIK = peserta.map((peserta) => {
    return {
      id: peserta.id,
      nik: peserta.nik,
    };
  });
  const randomIndex = Math.floor(Math.random() * pesertaNIK.length);
  const randomPeserta = pesertaNIK[randomIndex];
  return { ...randomPeserta };
};

export const updatePeserta = async (nik: string) => {
  const peserta = await prisma.peserta.update({
    where: {
      nik: nik,
    },
    data: {
      status: true,
    },
  });
  return peserta;
};

export const createPesertaMany = async (
  peserta: Prisma.PesertaCreateManyInput[] | null
) => {
  if (!peserta) {
    throw new Error("Peserta is null");
  }
  const result = await prisma.peserta.createMany({
    data: peserta,
    skipDuplicates: true,
  });
  return result;
};
