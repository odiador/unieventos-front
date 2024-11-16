import { PDFDocument } from 'pdf-lib';

/**
 * Ahí si no lo pude hacer yo
 * 
 * @author Microsoft Copilot
 */
async function createPdfFromUint8Array(data: Uint8Array, filetype: string, name: string) {
    const pdfDoc = await PDFDocument.load(data);

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], { type: filetype });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = name;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export { createPdfFromUint8Array }