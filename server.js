// server.js
import express from 'express';
import musicRoutes from './routes/music.js'; // ES module kullanıyorsanız .js uzantısını ekleyin

const app = express();

// JSON body'leri parse edebilmek için middleware
app.use(express.json());

// API endpointlerini mount ediyoruz.
app.use('/api/music', musicRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server ${port} portunda çalışıyor.`);
});
