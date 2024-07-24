import PDFDocument from "pdfkit";
import fs from "fs";

export const generatePdf = (outputPath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    let stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Aquí puedes agregar tu diseño PDFKit
    doc.fontSize(25).text("Hello, PfDd!", 100, 100);

    doc.end();
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
};
