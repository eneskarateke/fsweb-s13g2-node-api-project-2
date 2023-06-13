// posts için gerekli routerları buraya yazın
const router = require("express").Router();

const {
  find,
  findById,
  insert,
  update,
  remove,
  findPostComments,
  findCommentById,
  insertComment,
} = require("./posts-model.js");

// POST /
router.post("/", async (req, res) => {
  try {
    const { title, contents } = req.body;
    if (!title || !contents) {
      res.status(400).json({
        message: "Lütfen gönderi için bir title ve contents sağlayın",
      });
    } else {
      const ids = await insert({ title, contents });
      const post = await findById(ids.id);
      res.status(201).json(post);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
  }
});

// GET /
router.get("/", async (req, res) => {
  try {
    const posts = await find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Gönderiler alınamadı" });
  }
});
// GET /:id
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const post = await findById(id);
    if (!post) {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    } else {
      res.json(post);
    }
  } catch (error) {
    res.status(500).json({ message: "Gönderi bilgisi alınamadı" });
  }
});

// DELETE /:id
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const post = await findById(id);

    if (!post) {
      return res
        .status(404)
        .json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    } else {
      await remove(id);
      res.json(post);
    }
  } catch (error) {
    res.status(500).json({ message: "Gönderi silinemedi" });
  }
});

// PUT /:id
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { title, contents } = req.body;
  try {
    const post = await findById(id);
    if (!post) {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    } else {
      if (!title || !contents) {
        res.status(400).json({
          message: "Lütfen gönderi için bir title ve contents sağlayın",
        });
      } else {
        await update(id, { title, contents });
        const updatedPost = await findById(id);
        res.json(updatedPost);
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Gönderi bilgileri güncellenemedi" });
  }
});

// GET /:id/comments
router.get("/:id/comments", async (req, res) => {
  const id = req.params.id;

  try {
    const post = await findById(id);
    if (!post) {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    } else {
      const postsComments = await findPostComments(id);
      res.json(postsComments);
    }
  } catch (error) {
    res.status(500).json({ message: "Yorumlar bilgisi getirilemedi" });
  }
});

module.exports = router;
