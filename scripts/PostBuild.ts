import { mkdirSync, readdirSync, copyFileSync } from 'fs'
import { execSync } from 'child_process'
import { join } from 'path'

const copyFolderSync = (src: string, dest: string) => {
  mkdirSync(dest, { recursive: true })!
  const srcFiles = readdirSync(src, { withFileTypes: true })
  srcFiles.forEach((file) => {
    const srcFilePath = join(src, file.name)
    const destFilePath = join(dest, file.name)
    file.isDirectory() ? copyFolderSync(srcFilePath, destFilePath) : copyFileSync(srcFilePath, destFilePath)
  })
}

copyFolderSync('src/template', 'dist/template')
copyFileSync('scripts/script-package.json', 'dist/package.json')
copyFileSync('LICENSE', 'dist/LICENSE')
copyFileSync('README.md', 'dist/README.md')

execSync('npm install', { cwd: 'dist', stdio: 'inherit' })
