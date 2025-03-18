// pages/discord-card.tsx

import { GetServerSideProps } from 'next';
import chromium from 'chrome-aws-lambda';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  let browser = null;
  try {
    // Headless Chromium’u başlatıyoruz (Vercel gibi ortamlarda chrome-aws-lambda kullanılabilir)
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: true,
    });

    const page = await browser.newPage();

    // Discord kartı sayfanızın URL’sini girin.
    // Eğer kartı render eden sayfa '/discord-card' ise, onu kullanın.
    await page.goto('https://icelater.vercel.app/discord-card', {
      waitUntil: 'networkidle0',
    });

    // Eğer sayfadaki belirli bir elementin yüklenmesini beklemek isterseniz:
    // await page.waitForSelector('#discord-card');

    // Sayfanın tam ekran görüntüsünü PNG olarak alıyoruz.
    const screenshotBuffer = await page.screenshot({ type: 'png' });

    // Yanıtı PNG içerik tipiyle gönderiyoruz.
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'no-cache');
    res.statusCode = 200;
    res.end(screenshotBuffer);
  } catch (error) {
    console.error('Resim oluşturma hatası:', error);
    res.statusCode = 500;
    res.end('Resim oluşturulamadı');
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  // Bu sayfada hiçbir props gönderilmeyecek, çünkü response doğrudan sonlandırıldı.
  return { props: {} };
};

export default function DiscordCardPage() {
  // Bu component sunucu tarafı yanıtı ürettiği için istemciye hiçbir şey render etmez.
  return null;
}
