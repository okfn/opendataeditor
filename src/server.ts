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
export type IRequest = express.Request
export type IResponse = express.Response
const promiseExec = util.promisify(exec)
const upload = multer()

export class Server {
  protected app: express.Express
  protected server?: any

  constructor() {
    this.app = express()
    this.app.use(express.json({ limit: '10mb' }))
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(morgan('tiny'))
    this.app.use(cors())
    // TODO: add serving '/docs' as a static endpoint?
    this.app.post('/api/describe', upload.single('file'), this.describe)
    this.app.post('/api/extract', upload.single('file'), this.extract)
    this.app.post('/api/validate', upload.single('file'), this.validate)
    this.app.post('/api/transform', upload.single('file'), this.transform)
  }

  // Listen

  start({ port }: { port: number }) {
    this.server = this.app.listen(port, () => {
      console.log(`Server listening on port ${port}!`)
    })
  }

  stop() {
    if (this.server) {
      this.server.close()
    }
  }

  // Routes

  protected async describe(request: IRequest, response: IResponse) {
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
  }

  protected async extract(request: IRequest, response: IResponse) {
    if (!request.file) {
      response.json({ error: true })
      return
    }
    const { path, cleanup } = await file({
      postfix: pathmodule.extname(request.file.originalname),
    })
    fs.promises.writeFile(path, request.file.buffer)
    const command = `frictionless extract ${path} --json`
    const { stdout } = await promiseExec(command)
    const rows = JSON.parse(stdout)
    cleanup()
    response.json({ error: false, rows })
  }

  protected async validate(request: IRequest, response: IResponse) {
    if (!request.file) {
      response.json({ error: true })
      return
    }
    const { path, cleanup } = await file({
      postfix: pathmodule.extname(request.file.originalname),
    })
    fs.promises.writeFile(path, request.file.buffer)
    const command = `frictionless validate ${path} --json`
    const { stdout } = await promiseExec(command)
    const report = JSON.parse(stdout)
    cleanup()
    response.json({ error: false, report })
  }

  protected async transform(request: any, response: IResponse) {
    if (!request.file) {
      response.json({ error: true })
      return
    }
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
    const targetRows = JSON.parse(result2.stdout)
    response.json({ error: false, status, targetRows })
    dir.cleanup()
  }
}
