import axiosInstance from './axios'
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

// Upload file lên server của bạn → return URL
export async function handleImageUpload(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const res = await axiosInstance.post('http://localhost:8000/api/upload', formData)

  if (!res) throw new Error('Upload failed')

  return res.data
}
