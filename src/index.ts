#! /usr/bin/env node
import { mkdirSync, writeFileSync, existsSync, readdirSync, copyFileSync } from 'fs'
import { execSync } from 'child_process'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createInterface } from 'readline'
import { Prepare } from 'colorterm'

const TERMINAL_BLUE = '#1E90FF'
const TERMINAL_YELLOW = '#E3B505'
const TERMINAL_GREEN = '#4AF725'
const TERMINAL_RED = '#CC0000'
const blue = Prepare(TERMINAL_BLUE)
const green = Prepare(TERMINAL_GREEN)
const yellow = Prepare(TERMINAL_YELLOW)
const red = Prepare(TERMINAL_RED)

const copyFolderSync = (src: string, dest: string) => {
  mkdirSync(dest, { recursive: true })!
  const srcFiles = readdirSync(src, { withFileTypes: true })
  srcFiles.forEach((file) => {
    const srcFilePath = join(src, file.name)
    const destFilePath = join(dest, file.name)
    file.isDirectory() ? copyFolderSync(srcFilePath, destFilePath) : copyFileSync(srcFilePath, destFilePath)
  })
}
const openColor = (color: (value: string) => string) => {
  return color('').replace('\x1B[0m', '')
}

const resetColors = () => {
  return '\x1B[0m'
}

const path = (path: string) => {
  return join(dirname(fileURLToPath(import.meta.url)), path)
}
const getLatest = (packageName: string) => {
  return execSync(`npm view ${packageName} version`).toString().trim()
}

function isValidPackageName(value: string) {
  const validationRegex = /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/
  return validationRegex.test(value)
}
const { log } = console

const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
})
const packageJsontemp = {
  private: true,
  version: '1.0.0',
  scripts: {
    start: 'vite',
    build: 'tsc && vite build',
    preview: 'vite preview',
  },
}

const createProject = (projectName: string, packageName?: string) => {
  const projectPath = mkdirSync(projectName, { recursive: true })!
  log(resetColors() + '- ' + blue('Getting latest versions of npm packages...'))
  const latestLegot = getLatest('legot')
  const latestVite = getLatest('vite')
  const latestTs = getLatest('typescript')
  const latestTsPaths = getLatest('vite-tsconfig-paths')

  log('- ' + blue('Scaffolding project in : ') + projectPath)

  copyFolderSync(path('./template'), projectPath)
  const devDeps = {
    typescript: '^' + latestTs,
    vite: '^' + latestVite,
    'vite-tsconfig-paths': '^' + latestTsPaths,
  }
  const deps = {
    legot: '^' + latestLegot,
  }
  const packageJson = {
    name: packageName || projectName.toLowerCase(),
    ...packageJsontemp,
    dependencies: deps,
    devDependencies: devDeps,
  }

  writeFileSync(join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2))

  log('\u2705 ' + blue('Done scaffolding'))
  log('- ' + yellow('Installing npm packages...'))
  execSync('npm install', { cwd: projectPath, stdio: 'inherit' })
  log('\u2705 ' + yellow('Done installing packages.'))
  log(blue('Navigate to: ') + projectPath)
  log(blue('and run: ') + yellow('npm start '))
  log(blue('Check package.json for available scripts\n'))
}

const getProjectName = () => {
  readline.question(blue('Enter project name: ') + openColor(green), (projectName) => {
    if (!projectName) {
      return getProjectName()
    }
    if (existsSync(projectName)) {
      log(resetColors() + red(`Directory "${projectName}" already exists`))
      return getProjectName()
    }
    if (isValidPackageName(projectName)) {
      createProject(projectName)
      readline.close()
    } else {
      const rec = () => {
        readline.question(blue('Enter package name: '), (packageName) => {
          if (!isValidPackageName(packageName)) {
            log(red('Invalid package name!'))
            rec()
          } else {
            createProject(projectName, packageName)
            readline.close()
          }
        })
      }
      rec()
    }
  })
}

const start = () => {
  readline.question(blue(`Create a new Legot application? (y/n) `), (value) => {
    switch (value.toLowerCase()) {
      case 'y':
        getProjectName()
        break
      case 'n':
        log('create Legot app cancelled.')
        readline.close()
        break
      default:
        start()
        break
    }
  })
}
start()
