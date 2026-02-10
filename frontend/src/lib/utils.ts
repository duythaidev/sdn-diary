import { type ClassValue, clsx } from 'clsx'
import { $getRoot, type LexicalEditor } from 'lexical'
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html'
import { twMerge } from 'tailwind-merge'
import { MOODS } from '@/constants'

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
    $getRoot()
      .clear()
      .append(...nodes)
  })
}

export const getMoodIcon = (mood: string) => {
  const moodData = MOODS.find((m) => m.value === mood)
  return moodData?.icon
}

export const getMoodLabel = (mood: string) => {
  const moodData = MOODS.find((m) => m.value === mood)
  return moodData?.label
}

export const getMoodColor = (mood: string) => {
  const moodData = MOODS.find((m) => m.value === mood)
  return moodData?.color
}

export const getCardGradient = (selectedMood: string) => {
  const gradients: Record<string, string> = {
    stressed: 'from-orange-900/30 to-orange-950/50',
    okay: 'from-gray-700/30 to-gray-800/50',
    calm: 'from-blue-900/30 to-blue-950/50',
    happy: 'from-green-900/30 to-green-950/50',
    great: 'from-purple-900/30 to-purple-950/50',
  }
  return gradients[selectedMood] || 'from-gray-800/30 to-gray-900/50'
}
