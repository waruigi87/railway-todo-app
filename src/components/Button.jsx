import styles from './Button.module.css'

export default function Button({
  type = 'button',
  children,
  isSubmitting = false,
  className = '',
  onClick,
  disabled = false, // 呼び出し側のdisabledもサポート
}) {
  // CSSを結合（共通スタイル + 呼び出し側独自クラス）
  const combinedClassName = `${styles.app_button} ${className}`.trim()

  return (
    <button
      type={type}
      className={combinedClassName}
      onClick={onClick}
      disabled={isSubmitting || disabled}
    >
      {children}
    </button>
  )
}
