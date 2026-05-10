/**
 * DYNAMIC YOUTUBE SEARCH SERVICE
 * Fetches real-time relevant career videos when hardcoded list fails
 */

export interface YouTubeVideo {
  title: string
  url: string
}

export async function searchCareerVideos(careerName: string, apiKey: string): Promise<YouTubeVideo[]> {
  if (!apiKey) return []

  try {
    const query = encodeURIComponent(`Career in ${careerName} roadmaps and salary india`)
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${query}&type=video&key=${apiKey}`

    const response = await fetch(url)
    if (!response.ok) {
      console.error('YouTube API Error:', response.status)
      return []
    }

    const data = await response.json()
    if (!data.items) return []

    return data.items.map((item: any) => ({
      title: item.snippet.title,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }))
  } catch (error) {
    console.error('YouTube Search Error:', error)
    return []
  }
}
