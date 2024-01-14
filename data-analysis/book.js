import { climbData, saveDB } from './request.js'

(async () => {
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

  bookVersion = await saveDB('book-version/add', bookVersion)

  const classifyData = []
  bookVersion.reduce((classifyData, { _id: pId }, index) => {
    const { Children: children = [] } = data[index] || {}
    
    children.forEach(({ GName: gradeName, GID: gradeType, TName: tName, TID: tId, BID: sourceId }) => {
      classifyData.push({ gradeName, gradeType, tName, tId, sourceId, pId })
    });

    return classifyData
  }, classifyData)
  const bookClassify = await saveDB('book-classify/add', classifyData)
  console.log(bookClassify, 'bookClassify')
})()