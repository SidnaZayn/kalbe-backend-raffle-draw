import { getRandomPeserta, updatePeserta, createPesertaMany, getPeserta, getPesertaById, deletePeserta } from "./service";
import { Router, Request } from "express";
import multer from "multer";
import XLSX from "xlsx";

interface MulterRequest extends Request {
  file: any;
}
const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    const { nik, search } = req.query;
    const isAll = req.query.all === "true";
    const peserta = await getPeserta(nik as string, search as string, isAll);
    res.status(200).json(peserta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const peserta = await getPesertaById(parseInt(id));
    if (!peserta) {
      res.status(404).json({ error: "Peserta not found" });
      return
    }
    res.status(200).json(peserta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/get-random", async (req, res) => {
  try {
    const peserta = await getRandomPeserta();
    res.status(200).json(peserta);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/update-status", async (req, res) => {
  const { nik } = req.body;
  if (!nik) {
    res.status(400).json({ error: "NIK is required" });
  }
  try {
    const peserta = await updatePeserta(nik);
    res.status(200).json(peserta);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(
  "/upload",
  upload.single("file"),
  async (req, res): Promise<any> => {
    const file = (req as MulterRequest).file;
    if (!file) {
      return res.status(400).send("No file uploaded.");
    }
    const buffer = file.buffer;
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }).splice(1);
    const peserta = data.map((row: any) => {
      return {
        nik: row[0].toString(),
        nama: row[1],
        status: false,
      };
    });
    try {
      const result = await createPesertaMany(peserta);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const peserta = await deletePeserta(parseInt(id));
    res.status(200).json(peserta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
export default router;
