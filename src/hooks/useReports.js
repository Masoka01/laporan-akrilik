import { useState, useRef, useCallback } from 'react'
import { todayStr, clone, blankFrom, loadLocal, persistLocal } from '../utils'

export function useReports() {
  const [reports, setReports] = useState(() => loadLocal())
  const [state, setState] = useState(() => {
    const r = loadLocal()
    const today = todayStr()
    if (r[today]) return { date: today, items: clone(r[today].items || []) }
    const keys = Object.keys(r).sort()
    if (keys.length) return blankFrom(r[keys[keys.length-1]], today)
    return { date: today, items: [] }
  })
  const [saveStatus, setSaveStatus] = useState('new') // 'new' | 'draft' | 'saving' | 'saved' | 'error'
  const timerRef = useRef(null)
  const dirtyRef = useRef(false)

  const doSave = useCallback((currentState, currentReports) => {
    if (!dirtyRef.current) return
    const payload = { tanggal: currentState.date, items: clone(currentState.items), updatedAt: Date.now() }
    dirtyRef.current = false
    setSaveStatus('saving')

    const next = { ...currentReports, [currentState.date]: payload }
    setReports(next)
    persistLocal(next)
    setSaveStatus('saved')
  }, [])

  const touch = useCallback((newState, currentReports) => {
    dirtyRef.current = true
    setSaveStatus('draft')
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      doSave(newState, currentReports)
    }, 900)
  }, [doSave])

  const flush = useCallback((currentState, currentReports) => {
    return new Promise(resolve => {
      if (!dirtyRef.current) { resolve(); return }
      clearTimeout(timerRef.current)
      doSave(currentState, currentReports)
      resolve()
    })
  }, [doSave])

  const updateItems = useCallback((updater) => {
    setState(prev => {
      const next = { ...prev, items: updater(prev.items) }
      touch(next, reports)
      return next
    })
  }, [touch, reports])

  const changeDate = useCallback((newDate, currentReports) => {
    if (currentReports[newDate]) {
      setState({ date: newDate, items: clone(currentReports[newDate].items || []) })
      setSaveStatus('saved')
      dirtyRef.current = false
    } else {
      setState(prev => {
        const next = { ...prev, date: newDate }
        dirtyRef.current = true
        setSaveStatus('draft')
        return next
      })
    }
  }, [])

  const loadReport = useCallback((date, currentReports) => {
    setState({ date, items: clone(currentReports[date].items || []) })
    setSaveStatus('saved')
    dirtyRef.current = false
  }, [])

  const deleteReport = useCallback((date) => {
    setReports(prev => {
      const next = { ...prev }
      delete next[date]
      persistLocal(next)
      return next
    })
    setState(prev => {
      if (prev.date === date) {
        dirtyRef.current = false
        setSaveStatus('new')
        return { ...prev, items: [] }
      }
      return prev
    })
  }, [])

  const newReport = useCallback((currentState, currentReports) => {
    const today = todayStr()
    if (currentReports[today] && currentState.date !== today) {
      loadReport(today, currentReports)
      return null // no toast
    }
    const keys = Object.keys(currentReports).sort()
    const src = currentReports[currentState.date] || (keys.length ? currentReports[keys[keys.length-1]] : null)
    const next = blankFrom(src, today)
    dirtyRef.current = false
    setSaveStatus('new')
    setState(next)
    return next.items.length ? 'Bahan disalin dari laporan sebelumnya, jumlah dikosongkan' : 'Laporan baru'
  }, [loadReport])

  const retrySave = useCallback((currentState, currentReports) => {
    dirtyRef.current = true
    doSave(currentState, currentReports)
  }, [doSave])

  return {
    reports, setReports,
    state, setState,
    saveStatus, setSaveStatus,
    updateItems, changeDate, loadReport, deleteReport, newReport, flush, retrySave, touch,
  }
}
