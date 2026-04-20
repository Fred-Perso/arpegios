import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface TabFile {
  name: string;
  filename: string;
  size: number;
  ext: string;
}

export async function GET() {
  const tabsDir = path.join(process.cwd(), 'public', 'tabs');

  try {
    const files = fs.readdirSync(tabsDir);
    const GP_EXTS = new Set(['.gp', '.gp3', '.gp4', '.gp5', '.gpx']);

    const tabs: TabFile[] = files
      .filter(f => GP_EXTS.has(path.extname(f).toLowerCase()))
      .map(f => {
        const fullPath = path.join(tabsDir, f);
        const stat = fs.statSync(fullPath);
        const ext = path.extname(f).toLowerCase().slice(1);
        const name = path.basename(f, path.extname(f))
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase());
        return { name, filename: f, size: stat.size, ext };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json(tabs);
  } catch {
    return NextResponse.json([]);
  }
}
