import { useEffect, useState } from 'react'

export default function Toast({ message }) {
  const [visible, setVisible] = useState(false)
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    if (!message) return
    setDisplayed(message)
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 2200)
    return () => clearTimeout(t)
  }, [message])

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed left-1/2 -translate-x-1/2 max-w-[calc(100%-32px)] px-4 py-3 rounded-full bg-[#12202a] dark:bg-[#e4eef1] text-[#e8eef0] dark:text-[#12202a] text-sm font-medium transition-opacity duration-200 pointer-events-none z-50 bottom-[88px] md:bottom-8 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ bottom: `calc(88px + env(safe-area-inset-bottom, 0px))` }}
    >
      {displayed}
    </div>
  )
}