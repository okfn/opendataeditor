import fs from 'fs'
import util from 'util'
import cors from 'cors'
import morgan from 'morgan'
import multer from 'multer'
import express from 'express'
import pathmodule from 'path'
import * as tmp from 'tmp-promise'
import { file } from 'tmp-promise'
import { exec } from 'child_process'
import * as settings from './settings'
export type IRequest = express.Request
export type IResponse = express.Response
const promiseExec = util.promisify(exec)
const upload = multer()

// TODO: move server to Python

export class Server {
  protected app: express.Express
  protected server?: any

  constructor() {
    this.app = express()
    this.app.use(cors())
    this.app.use(morgan('tiny'))
    this.app.use(express.static('dist'))
    this.app.use(express.json({ limit: '100mb' }))
    this.app.use(express.urlencoded({ extended: true }))
    this.app.post('/api/describe', upload.single('file'), this.describe)
    this.app.post('/api/extract', upload.single('file'), this.extract)
    this.app.post('/api/validate', upload.single('file'), this.validate)
    this.app.post('/api/transform', upload.single('file'), this.transform)
  }

  start({ port }: { port?: number } = {}) {
    port = port || parseInt(process.env.PORT || '') || settings.DEFAULT_PORT
    this.server = this.app.listen(port, () => {
      console.log(`Server listening on port ${port}!`)
    })
  }

  stop() {
    if (this.server) {
      this.server.close()
    }
  }

  // Actions

  protected async describe(request: IRequest, response: IResponse) {
    try {
      if (!request.file) {
        response.json({ error: true })
        return
      }
      const { path, cleanup } = await file({
        postfix: pathmodule.extname(request.file.originalname),
      })
      fs.promises.writeFile(path, request.file.buffer)
      const command = `frictionless describe ${path} --json --stats --expand`
      const { stdout } = await promiseExec(command)
      const resource = JSON.parse(stdout)
      resource.path = request.file.originalname
      resource.name = pathmodule.parse(request.file.originalname).name
      cleanup()
      response.json({ error: false, resource })
    } catch (error) {
      response.json({ error: 'Internal error' })
    }
  }

  protected async extract(request: any, response: IResponse) {
    try {
      if (!request.file) {
        response.json({ error: true })
        return
      }
      const dir = await tmp.dir({ unsafeCleanup: true })
      const resource = JSON.parse(request.body.resource)
      const sourcePath = `${dir.path}/source.csv`
      const resourcePath = `${dir.path}/resource.json`
      resource.path = sourcePath
      fs.promises.writeFile(sourcePath, request.file.buffer)
      fs.promises.writeFile(resourcePath, JSON.stringify(resource))
      const command1 = `frictionless extract ${resourcePath} --trusted --json`
      const result1 = await promiseExec(command1)
      const rows = JSON.parse(result1.stdout)
      response.json({ error: false, rows })
      dir.cleanup()
    } catch (error) {
      response.json({ error: 'Internal error' })
    }
  }

  protected async validate(request: any, response: IResponse) {
    try {
      const dir = await tmp.dir({ unsafeCleanup: true })
      const inqiury = JSON.parse(request.body.inquiry)
      const sourcePath = `${dir.path}/source.csv`
      const inqiuryPath = `${dir.path}/inquiry.json`
      inqiury.tasks[0].source.path = sourcePath
      fs.promises.writeFile(sourcePath, request.file.buffer)
      fs.promises.writeFile(inqiuryPath, JSON.stringify(inqiury))
      const command1 = `frictionless validate ${inqiuryPath} --json`
      const result1 = await promiseExec(command1)
      const report = JSON.parse(result1.stdout)
      response.json({ error: false, report })
      dir.cleanup()
    } catch (error) {
      response.json({ error: 'Internal error' })
    }
  }

  protected async transform(request: any, response: IResponse) {
    try {
      const dir = await tmp.dir({ unsafeCleanup: true })
      const pipeline = JSON.parse(request.body.pipeline)
      const sourcePath = `${dir.path}/source.csv`
      const targetPath = `${dir.path}/target.csv`
      const pipelinePath = `${dir.path}/pipeline.json`
      pipeline.tasks[0].source.path = sourcePath
      pipeline.tasks[0].steps.push({ code: 'table-write', path: targetPath })
      fs.promises.writeFile(sourcePath, request.file.buffer)
      fs.promises.writeFile(pipelinePath, JSON.stringify(pipeline))
      const command1 = `frictionless transform ${pipelinePath} --json`
      const result1 = await promiseExec(command1)
      const status = JSON.parse(result1.stdout)
      const command2 = `frictionless extract ${targetPath} --json`
      const result2 = await promiseExec(command2)
      const rows = JSON.parse(result2.stdout)
      response.json({ error: false, status, rows })
      dir.cleanup()
    } catch (error) {
      response.json({ error: 'Internal error' })
    }
  }
}

export const server = new Server()
