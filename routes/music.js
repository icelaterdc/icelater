const express = require('express');
const router = express.Router();

router.post('/play', async (req, res) => {
  const { query } = req.body;
  try {
    const track = await client.player.play(query);
    res.json({ track });
  } catch (error) {
    console.error('Parça çalınırken hata:', error);
    res.status(500).json({ error: 'Parça çalınırken hata oluştu.' });
  }
});

router.post('/stop', async (req, res) => {
  try {
    await client.player.stop();
    res.json({ message: 'Müzik durduruldu.' });
  } catch (error) {
    res.status(500).json({ error: 'Müzik durdurulurken hata oluştu.' });
  }
});

router.post('/next', async (req, res) => {
  try {
    await client.player.skip();
    res.json({ message: 'Sonraki parçaya geçildi.' });
  } catch (error) {
    res.status(500).json({ error: 'Sonraki parçaya geçilirken hata oluştu.' });
  }
});

router.post('/previous', async (req, res) => {
  try {
    await client.player.previous();
    res.json({ message: 'Önceki parçaya geçildi.' });
  } catch (error) {
    res.status(500).json({ error: 'Önceki parçaya geçilirken hata oluştu.' });
  }
});

router.post('/loop', async (req, res) => {
  const { loop } = req.body;
  try {
    await client.player.setLoop(loop);
    res.json({ message: `Döngü modu ${loop ? 'aktif' : 'pasif'}.` });
  } catch (error) {
    res.status(500).json({ error: 'Döngü modu değiştirilirken hata oluştu.' });
  }
});

router.get('/status', async (req, res) => {
  try {
    const status = {
      track: {
        title: "Örnek Parça",
        artist: "Örnek Sanatçı",
        duration: 300,
        cover: "https://example.com/cover.jpg",
      },
      progress: 120,
    };
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Status bilgisi alınırken hata oluştu.' });
  }
});

module.exports = router;
