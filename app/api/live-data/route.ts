import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET() {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // capture browser console logs if needed
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    await page.goto('https://www.espncricinfo.com/live-cricket-score', {
      waitUntil: 'networkidle2',
    });

    // Wait for at least one card to appear
    await page.waitForSelector('.ds-mb-4', { timeout: 15000 });

    const matches = await page.evaluate(() => {
      const data = [];

      document.querySelectorAll('.ds-mb-4').forEach(card => {
        const seriesTitle =
          card.querySelector('h2 a span')?.textContent.trim() || '';

        card.querySelectorAll('.ds-no-tap-higlight').forEach(matchEl => {
          const result =
            matchEl.querySelector('p.ds-text-tight-s span')?.textContent.trim() ||
            '';

          const teams = [];
          matchEl.querySelectorAll('.ci-team-score').forEach(t => {
            const teamName = t.querySelector('p')?.textContent.trim() || '';
            const score = t.querySelector('strong')?.textContent.trim() || '';
            const overs = t.querySelector('span')?.textContent.trim() || '';
            const isWinner = !t.className.includes('ds-opacity-50');

            teams.push({ teamName, score, overs, isWinner });
          });

          data.push({
            series: seriesTitle,
            result,
            teams,
          });
        });
      });

      return data;
    });

    return NextResponse.json({ matches });
  } catch (err) {
    console.error('Scraping error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    if (browser) await browser.close();
  }
}
