import { PDFParse } from "pdf-parse";

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    const text = (result.text || "").trim();
    if (!text) {
      throw new Error("PDF contained no extractable text (it may be scanned/image-based).");
    }
    return text;
  } finally {
    await parser.destroy().catch(() => undefined);
  }
}
