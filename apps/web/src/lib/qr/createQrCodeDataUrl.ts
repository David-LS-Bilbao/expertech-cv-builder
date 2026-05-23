import * as QRCode from 'qrcode'

export async function createQrCodeDataUrl(value: string): Promise<string> {
  const normalizedValue = value.trim()

  if (!normalizedValue) return ''

  try {
    return await QRCode.toDataURL(normalizedValue, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 168,
      color: {
        dark: '#131b2e',
        light: '#ffffff',
      },
    })
  } catch {
    return ''
  }
}
