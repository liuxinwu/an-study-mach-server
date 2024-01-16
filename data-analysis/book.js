import { climbData, saveDB } from './request.js'

(async () => {
  // 获取书本版本信息
  const data = await climbData('get', 'https://api.jyeoo.com/math3/appTag/Books', {
    params: {
      ha: 0,
      fg: 0
    }
  })

  let bookVersion = data.map(({
    EName: name, EID: type,
  }) => ({
    name, type
  }));

  // 存储书本版本 如人教、北师大
  bookVersion = await saveDB('book-version/add', bookVersion)

  const classifyData = []
  bookVersion.reduce((classifyData, { _id: pId }, index) => {
    const { Children: children = [] } = data[index] || {}
    
    children.forEach(({ GName: gradeName, GID: gradeType, TName: tName, TID: tId, BID: sourceId }) => {
      classifyData.push({ gradeName, gradeType, tName, tId, sourceId, pId })
    });

    return classifyData
  }, classifyData)
  // 存储书本信息
  const bookClassify = await saveDB('book-classify/add', classifyData)
  
  for (const { sourceId: id, _id: bookId } of bookClassify) {
    let chapterMap = []
    let subChapterMap = []
    // 获取书本章节信息
    const data = await climbData('get', 'https://api.jyeoo.com//math3/APPTag/Book', { params: { id }})
    ;(data.Children || []).forEach(({
      Name: chapterName, ID: sourceId
    }) => {
      chapterMap.push({ chapterName, sourceId, bookId })
    });

    // 存储章节
    chapterMap = await saveDB('chapter/add', chapterMap)
    chapterMap.forEach((item, index) => {
      const { _id: chapterId } = item
      ;(data.Children[index].Children || []).forEach(({
        Name: name, ID: sourceId, Points: points
      }) => {
        subChapterMap.push({ name, bookId, chapterId, sourceId, points })
      })
    })
    // 存储子章节
    await saveDB('sub-chapter/add', subChapterMap)
  }
})()