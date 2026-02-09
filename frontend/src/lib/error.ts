import { AxiosError } from 'axios'

export function getAxiosErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    return error.response?.data?.message ?? error.message
  }
  return 'Unexpected error'
}
