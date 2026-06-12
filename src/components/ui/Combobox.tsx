"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Command, CommandList, CommandItem } from "cmdk"
import { Camera } from "lucide-react"
import { Input } from "./Input"

export type ComboboxItem = {
  value: string
  label: string
  [key: string]: any
}

type ComboboxProps = {
  placeholder?: string
  onSelect?: (item: ComboboxItem) => void
  fetchItems?: (search: string) => Promise<ComboboxItem[]>
  showCamera?: boolean
  onCameraClick?: () => void
}

export function Combobox({ placeholder, onSelect, fetchItems, showCamera, onCameraClick }: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [items, setItems] = useState<ComboboxItem[]>([])
  const [fetching, setFetching] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!search.trim() || !fetchItems) {
      setItems([])
      setOpen(false)
      return
    }

    const timer = setTimeout(async () => {
      setFetching(true)
      try {
        const results = await fetchItems(search)
        setItems(results)
        setOpen(results.length > 0)
      } finally {
        setFetching(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [search, fetchItems])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const handleSelect = useCallback((item: ComboboxItem) => {
    onSelect?.(item)
    setSearch("")
    setOpen(false)
    inputRef.current?.focus()
  }, [onSelect])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" && open) {
      e.preventDefault()
      const first = containerRef.current?.querySelector<HTMLElement>("[cmdk-item]")
      first?.focus()
    }
    if (e.key === "Escape") {
      setOpen(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => search.trim() && items.length > 0 && setOpen(true)}
            placeholder={placeholder}
          />
          {fetching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
            </div>
          )}
          {open && (
            <Command
              shouldFilter={false}
              className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg"
            >
              <CommandList className="max-h-full overflow-visible">
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={() => handleSelect(item)}
                    className="px-3 py-2 text-sm cursor-pointer aria-selected:bg-blue-50"
                  >
                    {item.label}
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          )}
        </div>
        {showCamera && (
          <button
            type="button"
            onClick={onCameraClick}
            className="shrink-0 inline-flex items-center justify-center h-10 w-10 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
            title="Escanear código de barras"
          >
            <Camera size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
