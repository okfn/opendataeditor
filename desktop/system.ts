import cp from 'child_process'
import util from 'util'
import log from 'electron-log'

export async function execFile(path: string, args: string[]) {
  const execFile = util.promisify(cp.execFile)
  log.info('[execFile:path]:', path)
  log.info('[execFile:args]:', args)
  const { stdout, stderr } = await execFile(path, args)
  if (stdout) log.info('[execFile:stdout]', stdout)
  if (stderr) log.error('[execFile:stderr]', stderr)
}
