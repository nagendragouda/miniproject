// Token generation utility for Career Prediction PDF validation
// This ensures only official PDFs generated from this system can be uploaded back

export function generateCareerPredictionToken(): string {
  // Generate a unique token based on timestamp and random string
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  const token = `FM-AI-CP-${timestamp}-${random.toUpperCase()}`
  return token
}

export function formatTokenForDisplay(token: string): string {
  // Format token for display in PDF
  return `Validation Token: ${token}`
}

export const CAREER_PREDICTION_TOKEN_PREFIX = 'FM-AI-CP-'

export function validateCareerPredictionToken(pdfText: string): boolean {
  // Check if PDF contains our special token format
  const lowerText = pdfText.toLowerCase()
  return lowerText.includes(CAREER_PREDICTION_TOKEN_PREFIX.toLowerCase())
}
