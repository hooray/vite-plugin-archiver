# vite-plugin-archiver

[![NPM version](https://img.shields.io/npm/v/vite-plugin-archiver?color=a1b858&label=)](https://www.npmjs.com/package/vite-plugin-archiver)

[English](./README.md) | **中文**

给构建产物存档

## 安装

```bash
npm i vite-plugin-archiver -D
```

## 使用

```ts
// vite.config.ts
import Archiver from 'vite-plugin-archiver'

export default defineConfig({
  plugins: [
    Archiver(/* 选项 */),
  ],
})
```

## 选项

```ts
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
```

## 范例

[Fantastic-admin](https://github.com/fantastic-admin/basic)
