export default function handler(req, res) {
  res.status(200).json({
    message: "Test kodu çalışıyor!",
    status: "Başarılı",
    data: {
      pages: ["anasayfa", "hakkında", "iletişim"]
    }
  });
}
