import * as cheerio from 'cheerio'

/**
 * 从 URL 抓取网页元数据
 * @param {string} url - 要抓取的网页 URL
 * @returns {Promise<{title: string, description: string, image: string}>}
 */
export const fetchMetadata = async (url) => {
  try {
    console.log(`🌐 Fetching metadata from: ${url}`)
    
    // 使用 fetch 获取网页内容（Node.js 18+ 原生支持）
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      signal: AbortSignal.timeout(10000) // 10秒超时
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const html = await response.text()
    const $ = cheerio.load(html)
    
    // 抓取标题（优先级：og:title > twitter:title > title 标签）
    let title = 
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text() ||
      $('h1').first().text() ||
      '未命名书签'
    
    // 清理标题（去除多余空格）
    title = title.trim()
    
    // 抓取描述
    const description = 
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      ''
    
    // 抓取图片
    const image = 
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('link[rel="image_src"]').attr('href') ||
      null
    
    // 抓取网站名称
    const siteName = 
      $('meta[property="og:site_name"]').attr('content') ||
      null
    
    console.log(`✅ Metadata fetched successfully:`)
    console.log(`   Title: ${title}`)
    console.log(`   Description: ${description ? description.substring(0, 50) + '...' : 'None'}`)
    console.log(`   Image: ${image || 'None'}`)
    console.log(`   Site: ${siteName || 'Unknown'}`)
    
    return {
      title,
      description: description?.trim() || '',
      image,
      siteName
    }
  } catch (error) {
    console.error(`❌ Failed to fetch metadata from ${url}:`, error.message)
    
    // 返回默认值，但尝试从 URL 中提取有意义的标题
    const fallbackTitle = extractTitleFromUrl(url)
    
    return {
      title: fallbackTitle,
      description: '',
      image: null,
      siteName: null,
      error: error.message
    }
  }
}

/**
 * 从 URL 中提取有意义的标题（作为备用方案）
 * @param {string} url 
 * @returns {string}
 */
const extractTitleFromUrl = (url) => {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.replace('www.', '')
    const pathname = urlObj.pathname
    
    // 如果路径有内容，尝试从路径提取标题
    if (pathname && pathname !== '/') {
      const pathParts = pathname.split('/').filter(p => p)
      if (pathParts.length > 0) {
        // 取最后一个路径段，去除扩展名，转换为可读格式
        const lastPart = pathParts[pathParts.length - 1]
          .replace(/\.[^/.]+$/, '') // 去除扩展名
          .replace(/[-_]/g, ' ') // 替换连字符和下划线
          .replace(/\b\w/g, l => l.toUpperCase()) // 首字母大写
        
        return `${lastPart} - ${hostname}`
      }
    }
    
    return hostname
  } catch (error) {
    return '未命名书签'
  }
}

/**
 * 验证 URL 是否有效
 * @param {string} url 
 * @returns {boolean}
 */
export const isValidUrl = (url) => {
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch (error) {
    return false
  }
}

