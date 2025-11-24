import React from 'react'
import { useEffect, useRef } from 'react'
import styles from './Modal.module.css'

export default function Modal({ isOpen, onClose, children }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    const dialog = dialogRef.current
    if (!dialog) return

    // 1. フォーカス可能要素を集める
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ]
    const focusableElements = dialog.querySelectorAll(
      focusableSelectors.join(',')
    )
    const first = focusableElements[0]
    const last = focusableElements[focusableElements.length - 1]

    // モーダルを開いたら最初の要素にフォーカス
    first?.focus()

    // 2. キーボードイベントで Esc & Tab を制御
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
      }

      if (event.key === 'Tab' && focusableElements.length > 0) {
        // フォーカストラップ
        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === first) {
            event.preventDefault()
            last.focus()
          }
        } else {
          // Tab
          if (document.activeElement === last) {
            event.preventDefault()
            first.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className={styles.modal_overlay} aria-modal="true" role="dialog">
      <div className={styles.modal_content} ref={dialogRef}>
        {children}
      </div>
    </div>
  )
}
