import fs from 'fs'
import util from 'util'
import cors from 'cors'
import morgan from 'morgan'
import multer from 'multer'
import express from 'express'
import pathmodule from 'path'
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
    this.app.post('/', upload.single('file'), this.main)
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

  protected async main(request: IRequest, response: IResponse) {
    if (!request.file) {
      response.json({ error: true })
      return
    }
    const { path, cleanup } = await file({
      postfix: pathmodule.extname(request.file.originalname),
    })
    fs.promises.writeFile(path, request.file.buffer)
    const command = `frictionless describe ${path} --json`
    const { stdout } = await promiseExec(command)
    const resource = JSON.parse(stdout)
    resource.path = request.file.originalname
    resource.name = pathmodule.parse(request.file.originalname).name
    cleanup()
    response.json({ error: false, resource })
  }
}
