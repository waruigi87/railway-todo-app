// InputField.jsx
export default function InputField({
  id,
  type = 'text',
  className = 'app_input',
  placeholder = '',
  value,
  checked,
  onChange,
}) {
  // チェックボックスか通常のinputかを自動で判定
  if (type === 'checkbox') {
    return (
      <input
        id={id}
        type="checkbox"
        className={className}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    )
  }

  return (
    <input
      id={id}
      type={type}
      className={className}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
