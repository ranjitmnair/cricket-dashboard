import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET() {
  let browser: puppeteer.Browser | null = null;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto('https://sports.ndtv.com/cricket/live-scores', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    // Wait for iframe containing scores
    const frameHandle = await page.waitForSelector('iframe', { timeout: 20000 });
    const frame = await frameHandle!.contentFrame();

    // Now scrape inside iframe
    await frame!.waitForSelector('.sp-scr_wrp', { timeout: 20000 });
    const matches = await frame!.evaluate(() => {
      const out: any[] = [];
      document.querySelectorAll('.sp-scr_wrp').forEach(card => {
        const description = card.querySelector('.description')?.textContent?.trim() || '';
        const teams: any[] = [];
        card.querySelectorAll('.scr_tm-wrp').forEach(t => {
          teams.push({
            teamName: t.querySelector('.scr_tm-nm')?.textContent?.trim() || '',
            teamScore: t.querySelector('.scr_tm-run')?.textContent?.trim() || ''
          });
        });
        out.push({ description, teams });
      });
      return out;
    });

    return NextResponse.json({ matches });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    if (browser) await browser.close();
  }
}
