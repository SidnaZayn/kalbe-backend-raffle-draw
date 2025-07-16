import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getPeserta = async (nik: string, search = "", isAll = false) => {
  const s = search.toLowerCase();
  if (isAll) {
    return await prisma.peserta.findMany({
      where: {
        OR: [{ nik: { contains: s } }, { nama: { contains: s } }],
      },
      orderBy: {
        id: "asc",
      },
    });
  }
  if (!nik) {
    const peserta = await prisma.peserta.findMany({
      where: {
        OR: [{ nik: { contains: s } }, { nama: { contains: s } }],
        status: isAll,
      },
      orderBy: {
        id: "asc",
      },
    });
    return peserta;
  } else {
    const peserta = await prisma.peserta.findMany({
      where: {
        nik: nik,
      },
      orderBy: {
        id: "asc",
      },
    });
    return peserta;
  }
};

export const getPesertaById = async (id: number) => {
  const peserta = await prisma.peserta.findUnique({
    where: {
      id,
    },
  });
  return peserta;
};

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

export const deletePeserta = async (id: number) => {
  const peserta = await prisma.peserta.delete({
    where: {
      id,
    },
  });
  return peserta;
}