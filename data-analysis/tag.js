// 题型 type 1 https://api.jyeoo.com//math3/AppTag/GetCommons?tp=1&pd=&g=
// 来源 type 2 https://api.jyeoo.com//math3/AppTag/GetCommons?tp=2&pd=&g=
// 能力 type 3 https://api.jyeoo.com//math3/AppTag/GetAbilities
// 知识点 type 4 https://api.jyeoo.com//V1/math3/Point/Get?tp=0&nd=0&kw=   Points
// 解题模型/方法 type 5 https://api.jyeoo.com//math3/apptag/GetSolutions   Topics solutionNo

import { climbData, saveDB } from "./request.js"

(async () => {
  const data = await Promise.all([
    climbData('get', 'https://api.jyeoo.com//math3/AppTag/GetCommons', { params: { tp: 1 } }),
    climbData('get', 'https://api.jyeoo.com//math3/AppTag/GetCommons', { params: { tp: 2 } }),
    climbData('get', 'https://api.jyeoo.com//math3/AppTag/GetAbilities')
  ])
  
  const tags = []
  data.forEach((_, index) => {
    _.forEach(({ Key: tag, Value: tagName }) => tags.push({ type: index + 1, tagName, tag }))
  })
  saveDB('tag/add', tags)

  const formatterData = (data, type, level = 0) => {
    const res = []
    data.forEach(({
      No: tag, Name: tagName, Children = []
    }) => {
      res.push({ type, tag, tagName, level })
      if (Children.length) res.push(...formatterData(Children, type, level + 1))
    })

    return res
  }

  const pointsRes = await climbData('get', 'https://api.jyeoo.com//V1/math3/Point/Get', { params: { tp: 0, nd: 0 } })
  const points = formatterData(pointsRes, 4)
  saveDB('tag/add', points)

  const { D = [] } = await climbData('get', 'https://api.jyeoo.com//math3/apptag/GetSolutions')
  const solutions = formatterData(D, 5)
  saveDB('tag/add', solutions)
})()