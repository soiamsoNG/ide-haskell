import {TextEditor} from 'atom'
import {getRootDir} from 'atom-haskell-utils'
import {format as cabalFormat} from './util-cabal-format'
import {format as filterFormat} from './util-stylish-haskell'

export async function prettifyFile (editor: TextEditor, format = 'haskell') {
  const [firstCursor, ...cursors] = editor.getCursors().map((cursor) => cursor.getBufferPosition())
  const modMap = {
    haskell: filterFormat,
    cabal: cabalFormat
  }
  if (!modMap[format]) { throw new Error(`Unknown format ${format}`) }
  const prettify = modMap[format]
  const workDir = (await getRootDir(editor.getBuffer())).getPath()
  try {
    const text = await prettify(editor.getText(), workDir)
    editor.setText(text)
    if (editor.getLastCursor()) {
      editor.getLastCursor().setBufferPosition(firstCursor, {autoscroll: false})
    }
    cursors.forEach((cursor) => {
      editor.addCursorAtBufferPosition(cursor, {autoscroll: false})
    })
  } catch (e) {
    atom.notifications.addError('Failed to prettify', {
      detail: e.message, stack: e.stack, dismissable: true
    })
  }
}
