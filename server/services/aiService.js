import OpenAI from 'openai'

// 初始化 OpenAI 客户端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

/**
 * 为书签生成 AI 摘要
 * @param {Object} bookmark - 书签对象，包含 url, title, notes 等信息
 * @returns {Promise<string>} - AI 生成的摘要
 */
export const generateBookmarkSummary = async (bookmark) => {
  try {
    // 检查 API Key 是否配置
    if (!process.env.OPENAI_API_KEY) {
      console.warn('⚠️  OPENAI_API_KEY not configured')
      return '⚠️ Please configure OPENAI_API_KEY to use AI summary feature.'
    }

    // 构建 prompt 并获取动态参数
    const { prompt, maxTokens, wordRange } = buildPrompt(bookmark)
    
    console.log(`📊 Content analysis: Generating ${wordRange} word summary (max ${maxTokens} tokens)`)

    // 调用 OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // 使用 GPT-3.5（便宜快速）
      messages: [
        {
          role: 'system',
          content: `You are a professional content summarization assistant. Generate summaries that match the content's richness:
- For brief content: Provide a SHORT, direct summary without padding or filler words
- For moderate content: Give a balanced overview of key points
- For rich content: Offer comprehensive coverage with detailed insights

Always be concise and informative. Avoid generic phrases. Focus on actual content value.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: maxTokens
    })

    const summary = response.choices[0].message.content.trim()
    return summary

  } catch (error) {
    console.error('❌ AI 摘要生成失败:', error.message)
    
    // 根据错误类型返回不同的提示
    if (error.status === 401) {
      return '❌ Invalid OpenAI API Key. Please check your configuration.'
    } else if (error.status === 429) {
      return '❌ API rate limit exceeded. Please try again later.'
    } else if (error.status === 500) {
      return '❌ OpenAI service temporarily unavailable. Please try again later.'
    } else {
      return `❌ Error generating summary: ${error.message}`
    }
  }
}

/**
 * 评估内容丰富度并返回适当的摘要长度指南
 * @param {Object} bookmark - 书签对象
 * @returns {Object} - 包含字数范围和 max_tokens 的对象
 */
const estimateContentRichness = (bookmark) => {
  let contentLength = 0
  
  // 计算标题长度
  if (bookmark.title) {
    contentLength += bookmark.title.length
  }
  
  // 计算笔记长度（笔记通常是用户对内容的总结，权重更高）
  if (bookmark.notes && bookmark.notes.trim()) {
    contentLength += bookmark.notes.length * 2
  }
  
  // URL 本身提供一些信息
  contentLength += bookmark.url.length * 0.3
  
  // 根据内容长度确定摘要长度
  // 短内容（< 100 字符）：30-50 词
  // 中等内容（100-300 字符）：50-80 词  
  // 较长内容（300-600 字符）：80-120 词
  // 丰富内容（> 600 字符）：120-180 词
  
  if (contentLength < 100) {
    return {
      wordRange: '30-50',
      maxTokens: 100,
      guideline: '简短精炼'
    }
  } else if (contentLength < 300) {
    return {
      wordRange: '50-80',
      maxTokens: 150,
      guideline: '适度概括'
    }
  } else if (contentLength < 600) {
    return {
      wordRange: '80-120',
      maxTokens: 250,
      guideline: '全面总结'
    }
  } else {
    return {
      wordRange: '120-180',
      maxTokens: 350,
      guideline: '详细阐述'
    }
  }
}

/**
 * 构建 AI prompt
 * @param {Object} bookmark - 书签对象
 * @returns {Object} - 包含 prompt 和摘要参数的对象
 */
const buildPrompt = (bookmark) => {
  let prompt = 'Please generate a concise summary for the following webpage:\n\n'
  
  // 添加标题
  if (bookmark.title) {
    prompt += `Title: ${bookmark.title}\n`
  }
  
  // 添加 URL
  prompt += `URL: ${bookmark.url}\n`
  
  // 添加域名信息
  if (bookmark.domain) {
    prompt += `Domain: ${bookmark.domain}\n`
  }
  
  // 如果用户有笔记，也加入 prompt
  if (bookmark.notes && bookmark.notes.trim()) {
    prompt += `\nUser Notes: ${bookmark.notes}\n`
  }
  
  // 根据内容丰富度获取适当的长度指南
  const richness = estimateContentRichness(bookmark)
  
  prompt += `\nPlease provide a ${richness.wordRange} word summary in English that includes:\n`
  prompt += '1. Main content of the webpage\n'
  prompt += '2. Key information or highlights\n'
  prompt += '3. Target audience or use cases (if applicable)\n\n'
  prompt += `Important: Adjust the detail level based on available information. If content is brief, keep summary concise and avoid filler words. If content is rich, provide comprehensive coverage.`
  
  return {
    prompt,
    maxTokens: richness.maxTokens,
    wordRange: richness.wordRange
  }
}

/**
 * 批量生成摘要
 * @param {Array} bookmarks - 书签数组
 * @returns {Promise<Array>} - 包含摘要的结果数组
 */
export const generateBatchSummaries = async (bookmarks) => {
  const results = []
  
  for (const bookmark of bookmarks) {
    try {
      const summary = await generateBookmarkSummary(bookmark)
      results.push({
        id: bookmark.id,
        success: true,
        summary
      })
      
      // 避免 API 速率限制，每次调用间隔 1 秒
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      results.push({
        id: bookmark.id,
        success: false,
        error: error.message
      })
    }
  }
  
  return results
}

