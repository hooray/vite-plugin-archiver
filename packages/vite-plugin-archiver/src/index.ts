import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import archiver from 'archiver'
import dayjs from 'dayjs'
import { filesize } from 'filesize'
import open from 'open'
import type { PluginOption } from 'vite'

interface VitePluginArchiverOptions {
  buildDir?: string
  archiveType: archiver.Format
  archiveZipOptions: archiver.ZipOptions
  archiveTarOptions: archiver.TarOptions
  formatTemplate: string
  open: boolean
}

export default function (userOptions: Partial<VitePluginArchiverOptions> = {}): PluginOption {
  const options: VitePluginArchiverOptions = {
    // default options
    ...{
      archiveType: 'zip',
      archiveZipOptions: {
        zlib: { level: 9 },
      },
      archiveTarOptions: {
        gzip: true,
        gzipOptions: { level: 9 },
      },
      formatTemplate: 'YYYY-MM-DD-HH-mm-ss',
      open: false,
    },
    // user options
    ...userOptions,
  }
  return {
    name: 'vite-plugin-archiver',
    apply: 'build',
    enforce: 'post',
    configResolved(config) {
      options.buildDir ??= config.build.outDir
    },
    closeBundle: {
      handler() {
        const archive = archiver(options.archiveType, {
          ...(options.archiveType === 'zip' && options.archiveZipOptions),
          ...(options.archiveType === 'tar' && options.archiveTarOptions),
        })
        const fileName = `${options.buildDir}.${dayjs().format(options.formatTemplate)}.${options.archiveType === 'zip' ? 'zip' : 'tar.gz'}`
        const outputPath = process.cwd()
        const output = fs.createWriteStream(path.join(outputPath, fileName))
        output.on('close', () => {
          // eslint-disable-next-line no-console
          console.log(`Archiver file: ${outputPath} (${filesize(archive.pointer(), { standard: 'jedec' })})`)
        })
        archive.pipe(output)
        archive.directory(options.buildDir!, false)
        archive.finalize()
        if (options.open) {
          open(outputPath)
        }
      },
      order: 'post',
    },
  }
}
