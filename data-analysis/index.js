import { glob } from 'glob'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'url'
import { resolve } from 'path'

/**
 * 判断是否是自定义占位符
 * @param {string} str 
 * @returns boolean
 */
const isCustomPlaceholder = str => {
  return str.startsWith('<!--')
}

/**
 * 提取占位符
 * <!--BA--><!--EA-->
 * @param {string} str 
 * @returns string[] 分割后得结果
 */
const extractPlaceholder = str => {
  const arr = str.split(/<\!--BA-->.*?<\!--EA-->/g)
  const res = []
  arr.forEach((_, index) => {
    if (index === arr.length - 1) return res.push(_)
    res.push(_, '<!--PLACEHOLDER-->')
  })
  return arr
}

/**
 * 提取单选占位符
 * （　　）
 * @param {string} str 
 * @returns string[] 分割后得结果
 * 
 * 注意
 * > '123'.split(/2/)
 * [ '1', '3' ]
 * > '123'.split(/(2)/)
 * [ '1', '2', '3' ]
 */
const extractRadio = str => {
  const arr = str.split(/（　　）/g)
  const res = []
  arr.forEach((_, index) => {
    if (index === arr.length - 1) return res.push(_)
    res.push(_, '<!--RADIO-->')
  })
  return res
}

const imgs = Object.create(null)
/**
 * 提取图片占位符
 * <img .*? \/>
 * @param {string} str 
 * @returns string[] 分割后得结果
 */
const extractImg = str => {
  const reg = /<img .*? \/>/g
  const arr = str.split(reg)
  const imgAtter = (str.match(reg) || []).map(str => {
    const atter = str.split(' ').slice(1, -1)
    const res = Object.create(null)
    atter.forEach(_ => {
      const [key, value] = _.split('=')
      res[key] = value
    })
    return res
  })
  const len = Object.keys(imgs)
  let imgIndex = 0

  const res = []
  arr.forEach((_, index) => {
    if (index === arr.length - 1) return res.push(_)
    const id = len + imgIndex
    res.push(_, `<!--IMG id=${id} -->`)
    imgs[id] = imgAtter[imgIndex]
    imgIndex++
  })
  return res
}

/**
 * 生成题目
 * @param {string[]} conetent 
 * return { type: number, content?: string }[]
 */
const generateContent = conetent => {
  return conetent.map(str => {
    if (str.startsWith('<!--IMG')) {
      const id = str.match(/id=(\d)/)[1] || null
      return {
        type: 3,
        conetent: imgs[id] || Object.create(null)
      }
    }

    switch(str) {
      case '<!--PLACEHOLDER-->':
        return { type: 1 }
      case '<!--RADIO-->':
        return { type: 2 }
      default:
        return { type: 0, conetent: str }
    }
  })
}

const generateQuestions = source => {
  return source.map(({ Cate: question, CateName: questionName, Content: content, Label: label, Points: points, Options: options }) => {
    let _content = extractRadio(content)
    _content = [..._content].reduce((res, content) => {
      res.push(...extractImg(content))
      return res
    }, [])
    let _options = options.reduce((res, content) => {
      res.push(extractImg(content))
      return res
    }, []).map(_ => generateContent(_))


    return {
      question, questionName, content: generateContent(_content), label, points, options: _options
    }
  })
}

(async () => {
  const allJsonFiles = await glob('source/*.json')
  // 使用 es6 Module 需要重新定义 __dirname、__filename
  const __dirname = resolve()
  const __filename = fileURLToPath(import.meta.url)
  const allContent = []
  
  for (const name of allJsonFiles) {
    let fileContent = await readFile(`${__dirname}/${name}`, {
      encoding: 'utf-8'
    })
    const { Data } = JSON.parse(fileContent)
    allContent.push(...generateQuestions(Data))
  }

  writeFile('./dist/questions.json', JSON.stringify(allContent))
})()