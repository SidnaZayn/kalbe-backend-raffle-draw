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
  let skipDepartemen = [];

  let countCikarang = await prisma.peserta.count({
    where: { departemen: "KALBE CIKARANG", status: true },
  });
  if (countCikarang >= 3) {
    skipDepartemen.push("KALBE CIKARANG");
  }

  let countBekasi = await prisma.peserta.count({
    where: { departemen: "KALBE BEKASI", status: true },
  });
  if (countBekasi >= 3) {
    skipDepartemen.push("KALBE BEKASI");
  }

  let countJakarta = await prisma.peserta.count({
    where: { departemen: "KALBE JAKARTA", status: true },
  });
  if (countJakarta >= 3) {
    skipDepartemen.push("KALBE JAKARTA");
  }
  
  const peserta = await prisma.peserta.findMany({
    where: {
      status: false,
      AND: {
        departemen: {
          notIn: skipDepartemen,
        },
      },
    },
    select: {
      nik: true,
      id: true,
      nama: true,
      departemen: true,
    },
    orderBy: {
      id: "asc",
    },
  });
  const pesertaNIK = peserta.map((peserta) => {
    return {
      id: peserta.id,
      nik: peserta.nik,
      nama: peserta.nama,
      departemen: peserta.departemen,
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
  let invalidPeserta: Prisma.PesertaCreateManyInput[] = [];
  let validPeserta: Prisma.PesertaCreateManyInput[] = [];

  for (let i = 0; i < peserta.length; i++) {
    if (
      peserta[i].departemen !== "KALBE CIKARANG" &&
      peserta[i].departemen !== "KALBE JAKARTA" &&
      peserta[i].departemen !== "KALBE BEKASI"
    ) {
      invalidPeserta.push(peserta[i]);
    } else {
      validPeserta.push(peserta[i]);
    }
  }
  const result = await prisma.peserta.createMany({
    data: validPeserta,
    skipDuplicates: true,
  });
  return { result, invalidPeserta };
};

export const deletePeserta = async (id: number) => {
  const peserta = await prisma.peserta.delete({
    where: {
      id,
    },
  });
  return peserta;
};
