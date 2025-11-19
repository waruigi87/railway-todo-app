// TextAreaField.jsx
export default function TextAreaField({
  id,
  className = 'app_input',
  placeholder = '',
  value,
  onChange,
}) {
  return (
    <textarea
      id={id}
      className={className}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
