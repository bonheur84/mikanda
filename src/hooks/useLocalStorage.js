import { useEffect, useState } from 'react'
import { readJson, writeJson } from '../services/storage.js'

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readJson(key, initialValue))

  useEffect(() => {
    writeJson(key, value)
  }, [key, value])

  return [value, setValue]
}
