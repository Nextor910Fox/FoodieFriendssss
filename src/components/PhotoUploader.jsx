import { useRef } from 'react'

export default function PhotoUploader({ photos, onChange, max = 8 }) {
  const inputRef = useRef()

  const handleFiles = (e) => {
    const files = Array.from(e.target.files)
    const remaining = max - photos.length
    const accepted = files.slice(0, remaining)
    const newPhotos = accepted.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))
    onChange([...photos, ...newPhotos])
    e.target.value = ''
  }

  const remove = (idx) => {
    const next = photos.filter((_, i) => i !== idx)
    onChange(next)
  }

  return (
    <div className="photo-uploader">
      {photos.map((p, i) => (
        <div key={i} className="photo-thumb-wrap">
          <img src={p.preview || p.url} className="preview" alt="" />
          <button type="button" className="remove" onClick={() => remove(i)}>×</button>
        </div>
      ))}
      {photos.length < max && (
        <button type="button" className="add-btn" onClick={() => inputRef.current.click()}>
          +
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleFiles}
      />
    </div>
  )
}
