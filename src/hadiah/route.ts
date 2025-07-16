import {
  createHadiah,
  deleteHadiah,
  getHadiah,
  getHadiahById,
  updateHadiah,
} from "./service";
import { Router, Request } from "express";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { nama } = req.body;
    if (!nama) throw Error("Nama is required");

    const hadiah = await createHadiah(req.body.nama);
    res.status(200).json(hadiah);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

router.post("/tukar", async (req, res) => {
  try {
    const targetId = parseInt(req.body.old_id);
    const targetChange = parseInt(req.body.new_id);
    if (!targetId || !targetChange) throw Error("ID is required");

    const targetData = await getHadiahById(targetId);
    if (!targetData) throw Error("ID not found");

    const targetDataChange = await getHadiahById(targetChange);
    if (!targetDataChange) throw Error("ID not found");

    const updateOld = await updateHadiah(targetId, {
      no_urut: targetDataChange.no_urut,
    });
    const updateNew = await updateHadiah(targetChange, {
      no_urut: targetData.no_urut,
    });
    res.status(200).json({ updateOld, updateNew });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

router.put("/update-pemenang/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pemenangId = req.body.pemenangId;
    if (!pemenangId) throw Error("Pemenang ID is required");

    await updateHadiah(parseInt(id), {
      pemenang: pemenangId,
    });
    res.status(200).json({ message: "Update Success" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

router.get("/", async (req, res) => {
  try {
    const { s } = req.query;
    const all = req.query.all === "true";
    const hadiah = await getHadiah(s, all);
    res.status(200).json(hadiah);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const hadiah = await deleteHadiah(parseInt(id));
    res.status(200).json(hadiah);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

export default router;
