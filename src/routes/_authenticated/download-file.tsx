import { createFileRoute } from '@tanstack/react-router'
import { DownloadFile } from '@/components/download-file'

export const Route = createFileRoute('/_authenticated/download-file')({
  component: DownloadFile,
})
