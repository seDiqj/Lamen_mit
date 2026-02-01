import XLSX from 'xlsx';
import { db } from '../server/db';
import { 
  branches, 
  financeOfficers, 
  customers, 
  customerBusinesses, 
  businessLicenses, 
  loans, 
  collaterals, 
  guarantors, 
  loanApprovals, 
  disbursements, 
  installments 
} from '../shared/schema';
import { eq } from 'drizzle-orm';

const excelSerialToDate = (serial: number): string | null => {
  if (!serial || typeof serial !== 'number') return null;
  const utcDays = Math.floor(serial - 25569);
  const date = new Date(utcDays * 86400 * 1000);
  return date.toISOString().split('T')[0];
};

const parseNumber = (val: any): number | null => {
  if (val === null || val === undefined || val === '' || val === 'N/A') return null;
  const num = parseFloat(String(val).replace(/,/g, ''));
  return isNaN(num) ? null : num;
};

const parseString = (val: any): string | null => {
  if (val === null || val === undefined || val === '' || val === 'N/A') return null;
  return String(val).trim();
};

const parseGender = (val: any): 'male' | 'female' | 'other' | null => {
  if (!val) return null;
  const g = String(val).toLowerCase().trim();
  if (g === 'male' || g === 'm') return 'male';
  if (g === 'female' || g === 'f') return 'female';
  return 'other';
};

async function importExcel() {
  console.log('Starting Excel import...');
  
  const workbook = XLSX.readFile('./attached_assets/ActiveFinance_1769936371529.xlsx');
  const sheet = workbook.Sheets['ActiveFinancing'];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  
  const headers = data[3] as string[];
  const rows = data.slice(4).filter((row: any) => row[0] && row[0] !== '');
  
  console.log(`Found ${rows.length} data rows`);
  
  const branchMap = new Map<string, string>();
  const officerMap = new Map<string, string>();
  const customerMap = new Map<string, string>();
  const businessMap = new Map<string, string>();
  const loanMap = new Map<string, string>();
  
  for (const row of rows as any[]) {
    const getVal = (colName: string) => {
      const idx = headers.indexOf(colName);
      return idx >= 0 ? row[idx] : null;
    };
    
    const branchName = parseString(getVal('Branch'));
    const branchShort = parseString(getVal('BranchShort'));
    const branchCode = parseString(getVal('Code'));
    
    if (branchName && !branchMap.has(branchName)) {
      const [inserted] = await db.insert(branches).values({
        name: branchName,
        shortName: branchShort,
        code: branchCode ? String(branchCode) : null,
      }).returning();
      branchMap.set(branchName, inserted.id);
      console.log(`Created branch: ${branchName}`);
    }
    
    const officerName = parseString(getVal('FinacneofficerName'));
    const officerCode = parseString(getVal('FinanceofficerCode'));
    const officerKey = `${officerName}-${branchName}`;
    
    if (officerName && !officerMap.has(officerKey)) {
      const [inserted] = await db.insert(financeOfficers).values({
        name: officerName,
        code: officerCode,
        branchId: branchName ? branchMap.get(branchName) : null,
      }).returning();
      officerMap.set(officerKey, inserted.id);
      console.log(`Created officer: ${officerName}`);
    }
    
    const customerNo = parseString(getVal('CustomerNo'));
    const firstName = parseString(getVal('Name'));
    const lastName = parseString(getVal('LastName'));
    const fatherName = parseString(getVal('FName'));
    const gender = parseGender(getVal('Gender'));
    const nationalId = parseString(getVal('NID'));
    const placeOfBirth = parseString(getVal('PoB'));
    const age = parseNumber(getVal('Age'));
    const homeAddress = parseString(getVal('HomeAddress'));
    const district = parseString(getVal('District'));
    const phoneNumber = parseString(getVal('PhoneNumber'));
    const secondPhone = parseString(getVal('2ndPhonenumber'));
    const numDependents = parseNumber(getVal('NoofDependents'));
    
    let customerId: string | null = null;
    if (customerNo && !customerMap.has(customerNo)) {
      const [inserted] = await db.insert(customers).values({
        customerNo,
        firstName,
        lastName,
        fatherName,
        gender,
        nationalId: nationalId ? String(nationalId) : null,
        placeOfBirth,
        age: age ? Math.floor(age) : null,
        homeAddress,
        district,
        phoneNumber: phoneNumber ? String(phoneNumber) : null,
        secondPhoneNumber: secondPhone ? String(secondPhone) : null,
        numberOfDependents: numDependents ? Math.floor(numDependents) : null,
      }).returning();
      customerMap.set(customerNo, inserted.id);
      customerId = inserted.id;
      console.log(`Created customer: ${firstName} ${lastName} (${customerNo})`);
    } else if (customerNo) {
      customerId = customerMap.get(customerNo) || null;
    }
    
    const businessName = parseString(getVal('BusinessName'));
    const businessProvince = parseString(row[43]); 
    const businessDistrict = parseString(row[44]);
    const businessVillage = parseString(row[45]);
    const businessAddress = parseString(row[46]);
    const yearsExp = parseNumber(row[47]);
    const fullPartTime = parseString(row[48]);
    const newJob = parseString(row[49]);
    const sector = parseString(getVal('Sector'));
    const businessType = parseString(getVal('Busieness'));
    
    let businessId: string | null = null;
    const businessKey = `${customerNo}-${businessName}`;
    if (businessName && customerId && !businessMap.has(businessKey)) {
      const [inserted] = await db.insert(customerBusinesses).values({
        customerId,
        businessName,
        province: businessProvince,
        district: businessDistrict,
        village: businessVillage,
        detailedAddress: businessAddress,
        yearsOfExperience: yearsExp ? Math.floor(yearsExp) : null,
        fullTimePartTime: fullPartTime,
        isNewJob: newJob === 'Yes',
        sector,
        businessType,
      }).returning();
      businessMap.set(businessKey, inserted.id);
      businessId = inserted.id;
    } else if (businessKey) {
      businessId = businessMap.get(businessKey) || null;
    }
    
    const licenseType = parseString(row[50]);
    const licensePresident = parseString(row[51]);
    const licenseNumber = parseString(row[52]);
    const licenseRegDate = row[53];
    const licenseExpDate = row[54];
    
    if (licenseNumber && businessId) {
      await db.insert(businessLicenses).values({
        customerBusinessId: businessId,
        licenseType,
        president: licensePresident,
        licenseNumber: String(licenseNumber),
        registerDate: typeof licenseRegDate === 'number' ? excelSerialToDate(licenseRegDate) : null,
        expiryDate: typeof licenseExpDate === 'number' ? excelSerialToDate(licenseExpDate) : null,
      });
    }
    
    const applicationId = parseString(getVal('ApplicationID'));
    const productName = parseString(getVal('Products'));
    const productCode = parseString(getVal('ProductCode'));
    const financingPurpose = parseString(getVal('FinancingPurpose'));
    const financingCycle = parseString(getVal('FinancingCycle'));
    const sourceOfFund = parseString(getVal('SourceofFund'));
    const previousFinancing = parseNumber(getVal('PreviouseFinancing'));
    const previousInstitution = parseString(getVal('Previouse_institution'));
    const requestDate = getVal('Request_Date');
    const requestAmount = parseNumber(getVal('Request_Amount'));
    const financingDuration = parseNumber(getVal('Financing_Duration_(Months)'));
    const gracePeriod = parseNumber(getVal('Grace_Period'));
    const numInstallments = parseNumber(getVal('No_of_Installment'));
    const principleAmount = parseNumber(getVal('PrincipleAmount'));
    const marginRate = parseNumber(getVal('Margin'));
    const profit = parseNumber(getVal('Profit'));
    const totalReceivable = parseNumber(getVal('Total_Receivable'));
    const installmentAmount = parseNumber(getVal('Installment_Amount'));
    
    let loanId: string | null = null;
    if (applicationId && customerId && !loanMap.has(applicationId)) {
      const [inserted] = await db.insert(loans).values({
        applicationId,
        customerId,
        branchId: branchName ? branchMap.get(branchName) : null,
        financeOfficerId: officerName ? officerMap.get(officerKey) : null,
        productName,
        productCode: productCode ? String(productCode) : null,
        financingPurpose,
        financingCycle: financingCycle ? 1 : null,
        sourceOfFund,
        previousFinancing: previousFinancing ? String(previousFinancing) : null,
        previousInstitution,
        requestDate: typeof requestDate === 'number' ? excelSerialToDate(requestDate) : null,
        requestAmount: requestAmount ? String(requestAmount) : null,
        financingDurationMonths: financingDuration ? Math.floor(financingDuration) : null,
        gracePeriod: gracePeriod ? Math.floor(gracePeriod) : null,
        numberOfInstallments: numInstallments ? Math.floor(numInstallments) : null,
        principleAmount: principleAmount ? String(principleAmount) : null,
        marginRate: marginRate ? String(marginRate) : null,
        profit: profit ? String(profit) : null,
        totalReceivable: totalReceivable ? String(totalReceivable) : null,
        installmentAmount: installmentAmount ? String(installmentAmount) : null,
        status: 'disbursed',
      }).returning();
      loanMap.set(applicationId, inserted.id);
      loanId = inserted.id;
      console.log(`Created loan: ${applicationId}`);
    } else if (applicationId) {
      loanId = loanMap.get(applicationId) || null;
    }
    
    const collateralOwner = parseString(row[55]);
    const collateralOwnerNid = parseString(row[56]);
    const collateralType = parseString(row[57]);
    const titleDeedNum = parseString(row[58]);
    const collateralProvince = parseString(row[59]);
    const collateralDistrict = parseString(row[60]);
    const collateralVillage = parseString(row[61]);
    const collateralAddress = parseString(row[62]);
    const purchasedPrice = parseNumber(row[63]);
    const marketPrice = parseNumber(row[64]);
    const sizeMm = parseString(row[65]);
    
    if (loanId && (collateralOwner || collateralType)) {
      await db.insert(collaterals).values({
        loanId,
        ownerName: collateralOwner,
        ownerNationalId: collateralOwnerNid ? String(collateralOwnerNid) : null,
        collateralType,
        titleDeedNumber: titleDeedNum ? String(titleDeedNum) : null,
        province: collateralProvince,
        district: collateralDistrict,
        village: collateralVillage,
        address: collateralAddress,
        purchasedPrice: purchasedPrice ? String(purchasedPrice) : null,
        marketPrice: marketPrice ? String(marketPrice) : null,
        sizeMm,
      });
    }
    
    const guarantorType = parseString(row[66]);
    const guarantorFirstName = parseString(row[67]);
    const guarantorLastName = parseString(row[68]);
    const guarantorFatherName = parseString(row[69]);
    const guarantorNid = parseString(row[70]);
    const guarantorPhone = parseString(row[71]);
    const guarantorAddress = parseString(row[72]);
    const guarantorDistrict = parseString(row[73]);
    const guarantorBusiness = parseString(row[74]);
    const guarantorBusinessAdd = parseString(row[75]);
    const guarantorBusinessDistrict = parseString(row[76]);
    const guarantorRelation = parseString(row[77]);
    const guarantorYearsExp = parseNumber(row[78]);
    
    if (loanId && guarantorFirstName) {
      await db.insert(guarantors).values({
        loanId,
        firstName: guarantorFirstName,
        lastName: guarantorLastName,
        fatherName: guarantorFatherName,
        nationalId: guarantorNid ? String(guarantorNid) : null,
        phoneNumber: guarantorPhone ? String(guarantorPhone) : null,
        homeAddress: guarantorAddress,
        district: guarantorDistrict,
        business: guarantorBusiness,
        businessAddress: guarantorBusinessAdd,
        businessDistrict: guarantorBusinessDistrict,
        relationshipWithCustomer: guarantorRelation,
        yearsOfExperience: guarantorYearsExp ? Math.floor(guarantorYearsExp) : null,
      });
    }
    
    const inventory = parseNumber(row[79]);
    const monthlyNetIncome = parseNumber(row[80]);
    const approvedAmount = parseNumber(row[81]);
    const approvedDate = row[82];
    const approvalDuration = parseNumber(row[83]);
    const grantAmount = parseNumber(row[84]);
    const approvalGracePeriod = parseNumber(row[85]);
    
    if (loanId && approvedAmount) {
      await db.insert(loanApprovals).values({
        loanId,
        inventory: inventory ? String(inventory) : null,
        monthlyNetIncome: monthlyNetIncome ? String(monthlyNetIncome) : null,
        approvedAmount: approvedAmount ? String(approvedAmount) : null,
        approvedDate: typeof approvedDate === 'number' ? excelSerialToDate(approvedDate) : null,
        financingDurationMonths: approvalDuration ? Math.floor(approvalDuration) : null,
        grantAmount: grantAmount ? String(grantAmount) : null,
        gracePeriod: approvalGracePeriod ? Math.floor(approvalGracePeriod) : null,
      });
    }
    
    const disbursementDate = row[86];
    const firstInstallmentDate = row[87];
    const maturityDate = row[88];
    
    if (loanId && disbursementDate) {
      await db.insert(disbursements).values({
        loanId,
        disbursementDate: typeof disbursementDate === 'number' ? excelSerialToDate(disbursementDate) : null,
        firstInstallmentDate: typeof firstInstallmentDate === 'number' ? excelSerialToDate(firstInstallmentDate) : null,
        maturityDate: typeof maturityDate === 'number' ? excelSerialToDate(maturityDate) : null,
      });
    }
    
    for (let i = 1; i <= 20; i++) {
      const baseIdx = 90 + (i - 1) * 7;
      const dueDate = row[baseIdx];
      const principle = parseNumber(row[baseIdx + 1]);
      const margin = parseNumber(row[baseIdx + 2]);
      const total = parseNumber(row[baseIdx + 3]);
      const variance = parseNumber(row[baseIdx + 4]);
      const paymentDate = row[baseIdx + 5];
      const lateDays = parseNumber(row[baseIdx + 6]);
      
      if (loanId && (dueDate || principle)) {
        await db.insert(installments).values({
          loanId,
          installmentNumber: i,
          dueDate: typeof dueDate === 'number' ? excelSerialToDate(dueDate) : null,
          principleAmount: principle ? String(principle) : null,
          marginAmount: margin ? String(margin) : null,
          totalAmount: total ? String(total) : null,
          installmentVariance: variance ? String(variance) : null,
          paymentDate: typeof paymentDate === 'number' ? excelSerialToDate(paymentDate) : null,
          lateDays: lateDays ? Math.floor(lateDays) : null,
          isPaid: paymentDate ? true : false,
        });
      }
    }
  }
  
  console.log('\n=== Import Summary ===');
  console.log(`Branches: ${branchMap.size}`);
  console.log(`Finance Officers: ${officerMap.size}`);
  console.log(`Customers: ${customerMap.size}`);
  console.log(`Businesses: ${businessMap.size}`);
  console.log(`Loans: ${loanMap.size}`);
  console.log('Import completed!');
}

importExcel().catch(console.error);
