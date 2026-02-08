import { type ClassValue, clsx } from 'clsx'
import { $getRoot, type LexicalEditor } from 'lexical'
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getHTMLFromEditor = (editor: LexicalEditor) => {
  let html = ''
  editor.getEditorState().read(() => {
    html = $generateHtmlFromNodes(editor, null) // null = toàn bộ nội dung
  })
  return html
}

export const setHTMLToEditor = (editor: LexicalEditor, html: string) => {
  editor.update(() => {
    const parser = new DOMParser()
    const dom = parser.parseFromString(html, 'text/html')
    const nodes = $generateNodesFromDOM(editor, dom)
    $getRoot().clear().append(...nodes)
  })
}
