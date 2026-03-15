import { NextResponse } from "next/server"
import { readdir, readFile, stat } from "fs/promises"
import path from "path"
import JSZip from "jszip"

const ROOT = process.cwd()

const IGNORE = new Set([
  "node_modules",
  ".next",
  ".git",
  ".turbo",
  "dist",
  "build",
  ".vercel",
  ".cache",
  "coverage",
  "__pycache__",
])

async function addDirectoryToZip(zip: JSZip, dirPath: string, zipPath: string) {
  const entries = await readdir(dirPath)

  for (const entry of entries) {
    if (IGNORE.has(entry) || entry.startsWith(".env")) continue

    const fullPath = path.join(dirPath, entry)
    const zipEntryPath = zipPath ? `${zipPath}/${entry}` : entry

    const info = await stat(fullPath)

    if (info.isDirectory()) {
      await addDirectoryToZip(zip, fullPath, zipEntryPath)
    } else {
      const content = await readFile(fullPath)
      zip.file(zipEntryPath, content)
    }
  }
}

export async function GET() {
  try {
    const zip = new JSZip()
    await addDirectoryToZip(zip, ROOT, "")

    const buffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    })

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="rishadnet-project.zip"',
        "Content-Length": String(buffer.length),
      },
    })
  } catch (err) {
    console.error("[download-code] Error generating zip:", err)
    return NextResponse.json({ error: "Failed to generate ZIP" }, { status: 500 })
  }
}
