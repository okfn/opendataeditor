import cp from 'child_process'
import util from 'util'
import log from 'electron-log'
const execFilePromise = util.promisify(cp.execFile)

export async function execFile(path: string, args: string[]) {
  log.info('[execFile]', path, args.join(' '))

  const { stdout, stderr } = await execFilePromise(path, args)

  if (stdout) log.info('[execFile]', 'stdout', stdout)
  if (stderr) log.error('[execFile]', 'stderr', stderr)
}
