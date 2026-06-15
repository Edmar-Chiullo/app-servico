"use client"

import { useEffect, useRef, useState } from "react"
import { Modal } from "./Modal"

type BarcodeScannerProps = {
  open: boolean
  onClose: () => void
  onDetected: (code: string) => void
}

export function BarcodeScanner({ open, onClose, onDetected }: BarcodeScannerProps) {
  const [error, setError] = useState("")
  const scannerRef = useRef<any>(null)
  const onDetectedRef = useRef(onDetected)
  onDetectedRef.current = onDetected

  async function stopScanner() {
    const s = scannerRef.current
    scannerRef.current = null
    try { await s?.stop() } catch { /* scanner já parou */ }
  }

  useEffect(() => {
    if (!open) {
      stopScanner()
      setError("")
      return
    }

    let mounted = true

    async function init() {
      try {
        const { Html5Qrcode } = await import("html5-qrcode")
        const scanner = new Html5Qrcode("barcode-reader")
        scannerRef.current = scanner

        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 150 } },
          (decodedText: string) => {
            if (mounted) {
              onDetectedRef.current(decodedText)
            }
          },
          () => {}
        )
      } catch (err: any) {
        if (mounted) {
          setError(err?.message || "Erro ao acessar câmera")
        }
      }
    }

    init()

    return () => {
      mounted = false
      stopScanner()
    }
  }, [open])

  return (
    <Modal open={open} onClose={onClose} title="Escanear Código" size="sm">
      <div className="space-y-4">
        {error ? (
          <div className="text-center py-8">
            <p className="text-red-500 text-sm mb-4">{error}</p>
            <p className="text-gray-500 text-xs">
              Verifique se a câmera está disponível e as permissões foram concedidas.
            </p>
          </div>
        ) : (
          <>
            <div id="barcode-reader" className="w-full aspect-square bg-black rounded-md overflow-hidden" />
            <p className="text-sm text-gray-500 text-center">
              Aponte a câmera para o código de barras do produto
            </p>
          </>
        )}
      </div>
    </Modal>
  )
}
