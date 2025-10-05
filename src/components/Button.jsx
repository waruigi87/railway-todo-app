import styles from './Button.module.css';

export default function Button({ type = `button`, children, isSubmitting = `false`, className = `${styles.button} ${className}`, onClick }) {
  
  
    const combinedClassName = `${styles.app_button} ${className}`.trim();

    return (
        <button type={type} className={combinedClassName} disabled={isSubmitting} onClick={onClick}>
          {children}
      </button>
  )
}

