import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createHadiah = async (hadiah_name: string, img_url:string) => {
  const last_data_length = await prisma.hadiah.aggregate({
    _count: {
      _all: true,
    },
  });

  const createHadiah = await prisma.hadiah.create({
    data: {
      nama: hadiah_name,
      no_urut: last_data_length._count._all + 1,
      img_url: img_url,
    },
  });

  return { last_data_length, createHadiah };
};

export const getHadiah = async (s: any, all = false) => {
  const where = s ? { nama: { contains: s } } : {};
  const allData = all ? {} : { equals: null };
  const hadiah = await prisma.hadiah.findMany({
    where: {
      ...where,
      AND: [
        {
          pemenang: allData,
        },
      ],
    },
    orderBy: {
      no_urut: "asc",
    },
  } as Prisma.HadiahFindManyArgs);
  return hadiah;
};

export const getHadiahById = async (id: number) => {
  const hadiah = await prisma.hadiah.findUnique({
    where: {
      id,
    },
  });
  return hadiah;
};

export const updateHadiah = async (
  id: number,
  data: Prisma.HadiahUpdateInput
) => {
  const hadiah = await prisma.hadiah.update({
    where: {
      id,
    },
    data,
  });
  return hadiah;
};

export const deleteHadiah = async (id: number) => {
  const hadiah = await prisma.hadiah.delete({
    where: {
      id,
    },
  });
  return hadiah;
};