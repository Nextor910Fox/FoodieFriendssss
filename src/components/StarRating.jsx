export default function StarRating({ value = 0, onChange, size = 'normal', readOnly = false }) {
  const stars = [1, 2, 3, 4, 5]
  return (
    <div className={size === 'small' ? 'small-stars' : 'stars'}>
      {stars.map(n => (
        <button
          key={n}
          type="button"
          className={n <= value ? 'active' : ''}
          onClick={() => !readOnly && onChange && onChange(n)}
          disabled={readOnly}
          style={size === 'small' ? { fontSize: 16 } : {}}
        >
          ★
        </button>
      ))}
    </div>
  )
}
