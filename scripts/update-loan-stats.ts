import XLSX from 'xlsx';
import { db } from '../server/db';
import { loans } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function updateLoanStats() {
  console.log('Reading Excel file...');
  const workbook = XLSX.readFile('./attached_assets/ActiveFinance_1769936371529.xlsx');
  const sheet = workbook.Sheets['ActiveFinancing'];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  
  const headers = data[3] as string[];
  const rows = data.slice(4).filter((row: any) => row[0] && row[0] !== '');
  
  // Find column indices
  const newAppIdIdx = headers.indexOf('NewApplicationID');
  const totalCollectionIdx = headers.indexOf('Total_Collection');
  const outstandingPortfolioIdx = headers.indexOf('Outstanding_Portfolio');
  
  console.log('Column indices:');
  console.log('NewApplicationID:', newAppIdIdx);
  console.log('Total_Collection:', totalCollectionIdx);
  console.log('Outstanding_Portfolio:', outstandingPortfolioIdx);
  
  let updated = 0;
  
  for (const row of rows as any[]) {
    const appId = String(row[newAppIdIdx] || '').trim();
    if (!appId) continue;
    
    const totalCollection = row[totalCollectionIdx];
    const outstandingPortfolio = row[outstandingPortfolioIdx];
    
    const tcValue = typeof totalCollection === 'number' ? String(totalCollection) : 
                    (totalCollection && totalCollection !== '' ? String(totalCollection).replace(/,/g, '') : null);
    const opValue = typeof outstandingPortfolio === 'number' ? String(outstandingPortfolio) : 
                    (outstandingPortfolio && outstandingPortfolio !== '' ? String(outstandingPortfolio).replace(/,/g, '') : null);
    
    if (tcValue || opValue) {
      await db.update(loans)
        .set({ 
          totalCollection: tcValue,
          outstandingPortfolio: opValue
        })
        .where(eq(loans.applicationId, appId));
      updated++;
    }
  }
  
  console.log(`Updated ${updated} loans with collection and outstanding data`);
  process.exit(0);
}

updateLoanStats().catch(console.error);
