import api from '../lib/api'

export const exportService = {
  /**
   * Downloads full JSON export — triggers browser file download
   */
  downloadJson: async () => {
    const res = await api.get('/export/json', {
      responseType: 'blob',
    })

    triggerDownload(
      res.data,
      `momentum-export-${today()}.json`,
      'application/json'
    )
  },

  /**
   * Downloads habit logs CSV — triggers browser file download
   */
  downloadCsv: async () => {
    const res = await api.get('/export/csv', {
      responseType: 'blob',
    })

    triggerDownload(
      res.data,
      `momentum-habit-logs-${today()}.csv`,
      'text/csv'
    )
  },
}

function triggerDownload(blob, filename, type) {
  const url = URL.createObjectURL(new Blob([blob], { type }))
  const link = document.createElement('a')

  link.href = url
  link.download = filename

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

function today() {
  return new Date().toISOString().slice(0, 10)
}
