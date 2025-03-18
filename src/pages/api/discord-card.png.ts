// pages/api/discord-card.png.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new', // veya true, puppeteer sürümünüze bağlı olarak
    });

    const page = await browser.newPage();

    // Vercel URL'nizi doğrudan kullanıyoruz:
    const targetUrl = 'https://icleater.vercel.app/discord-card';

    await page.goto(targetUrl, {
      waitUntil: 'networkidle0',
    });

    // "discord-card-root" elementinin sayfada görünmesini bekliyoruz
    await page.waitForSelector('#discord-card-root', {
      visible: true,
      timeout: 10000, // 10 saniye
    });

    // İsterseniz yalnızca belirli elementin ekran görüntüsünü de alabilirsiniz:
    // const cardElement = await page.$('#discord-card-root');
    // const screenshotBuffer = await cardElement.screenshot({ type: 'png' });

    // Tam sayfanın ekran görüntüsünü alıyoruz:
    const screenshotBuffer = await page.screenshot({ type: 'png' });

    await browser.close();

    // Yanıtı PNG olarak dönüyoruz
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.status(200).send(screenshotBuffer);
  } catch (error) {
    console.error(error);
    if (browser) await browser.close();
    res.status(500).json({ error: 'Screenshot failed.' });
  }
}
  
