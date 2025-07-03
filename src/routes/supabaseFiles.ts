import { Router } from "express";
import { createClient } from "@supabase/supabase-js";
import { authMiddleware } from "../middleware/auth";
import multer from "multer";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);


const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.delete("/delete-file", authMiddleware, async (req, res) => {
  const { path } = req.body;

  const oldPath = path.split("/storage/v1/object/public/multimedia/")[1];
  console.log("oldPath", oldPath);

  if (!path) {
    console.log("Path is required");
    return res.status(400).json({ message: "Path is required" });
  }

  const { error } = await supabase.storage.from("multimedia").remove([oldPath]);

  if (error) {
    console.error("Delete error:", error.message);
    return res.status(500).json({ message: "Failed to delete file" });
  }

  res.status(200).json({ message: "File deleted" });
  console.log("File deleted");
});

router.post("/upload-file", authMiddleware, upload.single("file"), async (req, res) => {
    const file = req.file;
    console.log("file", file);

    if (!file) {
      return res.status(400).json({ message: "Missing file" });
    }

    const fileExt = file.originalname.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `players/${fileName}`;

    const { error } = await supabase.storage
      .from("multimedia")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.error("Upload error:", error.message);
      return res.status(500).json({ message: "Upload failed" });
    }

    const { data } = supabase.storage.from("multimedia").getPublicUrl(filePath);

    res.status(200).json({ publicUrl: data.publicUrl });
  }
);

export default router;
