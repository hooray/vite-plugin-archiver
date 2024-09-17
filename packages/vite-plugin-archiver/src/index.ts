import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import archiver from 'archiver'
import dayjs from 'dayjs'
import { filesize } from 'filesize'
import open from 'open'
import type { PluginOption } from 'vite'

interface VitePluginArchiverOptions {
  /**
   * 存档目录，默认与 Vite 的输出目录相同
   * 查看：https://cn.vitejs.dev/config/build-options#build-outdir
   *
   * @default build.outDir
   */
  buildDir?: string
  /**
   * 存档类型，支持 zip 和 tar
   *
   * @default 'zip'
   */
  archiveType: archiver.Format
  /**
   * zip 选项
   * 查看：https://www.archiverjs.com/docs/archiver#zip-options
   *
   * @default { zlib: { level: 9 } }
   */
  archiveZipOptions: archiver.ZipOptions
  /**
   * tar 选项
   * 查看：https://www.archiverjs.com/docs/archiver#tar-options
   *
   * @default { gzip: true, gzipOptions: { level: 9 } }
   */
  archiveTarOptions: archiver.TarOptions
  /**
   * 存档文件名格式，使用 dayjs 格式化
   *
   * @default 'YYYY-MM-DD-HH-mm-ss'
   */
  formatTemplate: string
  /**
   * 完成时是否打开存档文件所在目录
   *
   * @default false
   */
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
