# vite-plugin-archiver

[![NPM version](https://img.shields.io/npm/v/vite-plugin-archiver?color=a1b858&label=)](https://www.npmjs.com/package/vite-plugin-archiver)

**English** | [中文](./README.CN.md)

Archive the build product

## Installation

```bash
npm i vite-plugin-archiver -D
```

## Usage

```ts
// vite.config.ts
import Archiver from 'vite-plugin-archiver'

export default defineConfig({
  plugins: [
    Archiver(/* options */),
  ],
})
```

## Options

```ts
interface VitePluginArchiverOptions {
  /**
   * Archive directory, defaults to the same as Vite's output directory
   * See: https://cn.vitejs.dev/config/build-options#build-outdir
   *
   * @default build.outDir
   */
  buildDir?: string
  /**
   * Archive types, zip and tar supported
   *
   * @default 'zip'
   */
  archiveType: archiver.Format
  /**
   * zip options
   * See: https://www.archiverjs.com/docs/archiver#zip-options
   *
   * @default { zlib: { level: 9 } }
   */
  archiveZipOptions: archiver.ZipOptions
  /**
   * tar options
   * See: https://www.archiverjs.com/docs/archiver#tar-options
   *
   * @default { gzip: true, gzipOptions: { level: 9 } }
   */
  archiveTarOptions: archiver.TarOptions
  /**
   * Archive filename format, formatted using dayjs
   *
   * @default 'YYYY-MM-DD-HH-mm-ss'
   */
  formatTemplate: string
  /**
   * Whether to open the archive file directory on completion
   *
   * @default false
   */
  open: boolean
}
```

## Example

[Fantastic-admin](https://github.com/fantastic-admin/basic)
