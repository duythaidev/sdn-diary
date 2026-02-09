import { AxiosError } from 'axios'

export function getAxiosErrorMessage(error: unknown, defaultMessage?: string) {
  if (error instanceof AxiosError) {
    return error.response?.data?.message ?? defaultMessage ?? 'Unexpected error'
  }
  return defaultMessage ?? 'Unexpected error'
}
