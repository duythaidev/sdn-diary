import { DefaultTemplate } from './DefaultTemplate'
import { useState } from 'react'

export default function Editor() {
  const [html, setHtml] = useState('')

  const handleChangeHTML = (content: string) => {
    setHtml(content)
  }
  return (
    <div className="p-4">
      <DefaultTemplate content={html} onChange={handleChangeHTML} />
    </div>
  )
}
