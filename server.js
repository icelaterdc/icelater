const express = require('express');
const app = express();
const port = 3000;

app.get('/pages', (req, res) => {
  res.status(200).json({
    message: 'Test kodu çalışıyor!',
    status: 'Başarılı',
    data: {
      pages: ['anasayfa', 'hakkında', 'iletişim'] 
    }
  });
});

app.listen(port, () => {
  console.log(`Server şurada çalışıyor: http://localhost:${port}`);
});
