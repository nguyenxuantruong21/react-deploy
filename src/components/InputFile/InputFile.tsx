import { useRef } from 'react'
import { toast } from 'react-toastify'
import config from 'src/constants/config'

interface Props {
  onChange?: (file?: File) => void
}

export default function InputFile({ onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0]
    if (fileFromLocal && fileFromLocal.size >= config.maxSizeUploadAvatar) {
      toast.error('Dụng lượng file tối đa 1MB Định dạng:.JPEG, .PNG', {
        position: 'top-center',
      })
    } else {
      onChange && onChange(fileFromLocal)
    }
  }

  // handle click button
  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <div>
      <input
        type='file'
        name='avatar'
        accept='.jpg, .png, .jpeg'
        className='hidden'
        ref={fileInputRef}
        onChange={onFileChange}
        onClick={(event) => {
          ;(event.target as any).value = null
        }}
      />
      <button
        type='button'
        onClick={handleUpload}
        className=' border border-gray-200 bg-white px-6  py-2 text-sm text-gray-600'
      >
        Chọn Ảnh
      </button>
    </div>
  )
}
