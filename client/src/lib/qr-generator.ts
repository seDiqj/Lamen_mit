import logoPath from "@assets/LamenLogoonly_1770454600405.png";

export interface QRLoanData {
  applicationId: string;
  customerName: string;
  amount: string | number;
  disbursementDate: string;
  productName: string;
  durationMonths: number;
}

export function generateQRText(data: QRLoanData): string {
  const lines = [
    `Lamen Microfinance Institution`,
    `Application ID: ${data.applicationId}`,
    `Customer: ${data.customerName}`,
    `Amount: AFN ${Number(data.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    `Product: ${data.productName}`,
    `Duration: ${data.durationMonths} months`,
    `Disbursement Date: ${data.disbursementDate}`,
  ];
  return lines.join("\n");
}

export async function generateQRWithLogo(text: string, size: number = 300): Promise<string> {
  const QRCode = (await import("qrcode")).default;

  const qrDataUrl = await QRCode.toDataURL(text, {
    width: size,
    margin: 2,
    color: { dark: "#000000", light: "#ffffff" },
    errorCorrectionLevel: "H",
  });

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const qrImg = new Image();
  await new Promise<void>((resolve, reject) => {
    qrImg.onload = () => resolve();
    qrImg.onerror = reject;
    qrImg.src = qrDataUrl;
  });
  ctx.drawImage(qrImg, 0, 0, size, size);

  const logo = new Image();
  await new Promise<void>((resolve, reject) => {
    logo.onload = () => resolve();
    logo.onerror = reject;
    logo.crossOrigin = "anonymous";
    logo.src = logoPath;
  });

  const logoSize = size * 0.22;
  const logoX = (size - logoSize) / 2;
  const logoY = (size - logoSize) / 2;
  const padding = 4;

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.roundRect(logoX - padding, logoY - padding, logoSize + padding * 2, logoSize + padding * 2, 6);
  ctx.fill();

  ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);

  return canvas.toDataURL("image/png");
}

export function downloadQRCode(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
