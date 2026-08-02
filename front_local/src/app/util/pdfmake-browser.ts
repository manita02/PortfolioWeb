import * as pdfMake from 'pdfmake/build/pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

interface PdfMakeWithVfs {
  vfs: Record<string, string>;
  fonts: Record<
    string,
    {
      normal: string;
      bold: string;
      italics: string;
      bolditalics: string;
    }
  >;
  createPdf: typeof pdfMake.createPdf;
}

interface VfsFontsModule {
  pdfMake: {
    vfs: Record<string, string>;
  };
}

let initialized = false;

function getPdfMake(): PdfMakeWithVfs {
  return pdfMake as unknown as PdfMakeWithVfs;
}

function loadVfsFonts(): VfsFontsModule {
  // CommonJS bundle required by pdfmake browser build.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require('pdfmake/build/vfs_fonts') as VfsFontsModule;
}

function ensurePdfMakeReady(): void {
  if (!initialized) {
    const pdf = getPdfMake();
    pdf.vfs = loadVfsFonts().pdfMake.vfs;
    pdf.fonts = {
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf',
      },
    };
    initialized = true;
  }
}

export async function downloadPdfDocument(
  doc: TDocumentDefinitions,
  filename: string
): Promise<void> {
  ensurePdfMakeReady();
  await getPdfMake().createPdf(doc).download(filename);
}
