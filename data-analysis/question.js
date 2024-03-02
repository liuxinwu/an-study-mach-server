import { glob } from 'glob';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'url';
import { resolve } from 'path';
import axiox from 'axios';
import { climbData, getData, saveDB } from './request.js';

(async () => {
  const sleep = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true)
      }, Math.random() * 1000 * 5 + 1000)
    })
  }
  const pointsMap = (await getData('tag/find', { params: { type: 4 } })).reduce(
    (_, { tag, _id }) => {
      _[tag] = _id;
      return _;
    },
    Object.create(null),
  );
  console.log('成功获取知识点数据！')
  const topicsMap = (
    await getData('tag/find', { params: { type: { $in: [3, 5] } } })
  ).reduce((_, { tag, _id }) => {
    _[tag] = _id;
    return _;
  }, Object.create(null));
  console.log('成功获取能力、解题模型/方法数据！')

  /**
   * 判断是否是自定义占位符
   * @param {string} str
   * @returns boolean
   */
  const isCustomPlaceholder = (str) => {
    return str.startsWith('<!--');
  };

  /**
   * 提取 table 里面的内容转换成填空
   * @param {string} str 
   */
  const extractTable = str => {
    const reg = /<table[.\r\n\s\S]*?<\/table>/g
    const arr = str.split(reg);
    const extractTd = str => {
      const contents = str.match(/[\d-\+×÷=]{4}/g) || []
      return contents.reduce((_, content) => {
        _.push(content, '<!--PLACEHOLDER-->')
        return _
      }, [])
    }
    const tdContent = (str.match(reg) || []).map(str => {
      return extractTd(str)
    })
    const res = []

    if (arr.length === 1) {
      res.push(arr[0]);
      return res;
    }

    arr.forEach((_, index) => {
      const tag = tdContent[index]
      if (_ === '' && index !== arr.length - 1) return res.push(...tag);
      if (_ === '' && index === arr.length - 1) return;
      if (_ !== '' && index === arr.length - 1) return res.push(_);
      res.push(_, ...tag)
    });

    console.log('提取占位符 table')
    return res;
  }

  /**
   * 提取占位符
   * <!--BA--><!--EA-->
   * @param {string} str
   * @returns string[] 分割后得结果
   */
  const extractPlaceholder = (str) => {
    const arr = str.split(/<\!--BA-->.*?<\!--EA-->/g);
    const res = [];

    if (arr.length === 1) {
      res.push(arr[0]);
      return res;
    }
    const tag = '<!--PLACEHOLDER-->';
    arr.forEach((_, index) => {
      if (_ === '' && index !== arr.length - 1) return res.push(tag);
      if (_ === '' && index === arr.length - 1) return;
      if (_ !== '' && index === arr.length - 1) return res.push(_);
      res.push(_, tag);
    });

    console.log('提取占位符 <!--BA--><!--EA-->')
    return res;
  };

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
  const extractRadio = (str) => {
    const arr = str.split(/（\s+）/g);
    const res = [];

    if (arr.length === 1) {
      res.push(arr[0]);
      return res;
    }
    const tag = '<!--RADIO-->';
    arr.forEach((_, index) => {
      if (_ === '' && index !== arr.length - 1) return res.push(tag);
      if (_ === '' && index === arr.length - 1) return;
      if (_ !== '' && index === arr.length - 1) return res.push(_);
      res.push(_, tag);
    });

    console.log('提取占位符 （　　）')
    return res;
  };

  const imgs = Object.create(null);
  /**
   * 提取图片占位符
   * <img .*? \/>
   * @param {string} str
   * @returns string[] 分割后得结果
   */
  const extractImg = (str) => {
    const reg = /<img .*? \/>/g;
    const arr = str.split(reg);
    const imgAtter = (str.match(reg) || []).map((str) => {
      const atter = str.split(' ').slice(1, -1);
      const res = Object.create(null);
      atter.forEach((_) => {
        const index = _.indexOf('=');
        const key = _.slice(0, index);
        const value = _.slice(index + 2, -1);
        res[key] = value;
      });
      return res;
    });
    let imageIndex = 0;
    const len = Object.keys(imgs).length;

    const res = [];
    if (arr.length === 1) {
      res.push(arr[0]);
      return res;
    }
    arr.forEach((_, index) => {
      const id = len + imageIndex + 1;
      const tag = `<!--IMG id=${id} -->`;
      if (_ === '' && index !== arr.length - 1)
        return res.push(tag), (imgs[id] = imgAtter[imageIndex++]);
      if (_ === '' && index === arr.length - 1) return;
      if (_ !== '' && index === arr.length - 1) return res.push(_);
      imgs[id] = imgAtter[imageIndex++];
      res.push(_, tag);
    });

    console.log('提取占位符 图片')
    return res;
  };

  /**
   * 生成题目
   * @param {string[]} content
   * return { type: number, content?: string }[]
   */
  const generateContent = (content) => {
    return content.map((str) => {
      if (str.startsWith('<!--IMG')) {
        const id = str.match(/id=(\d+)/)[1] || null;
        return {
          type: 3,
          content: imgs[id] || Object.create(null),
        };
      }

      switch (str) {
        case '<!--PLACEHOLDER-->':
          return { type: 1 };
        case '<!--RADIO-->':
          return { type: 2 };
        default:
          return { type: 0, content: str };
      }
    });
  };

  const QuestionsMap = {}
  const generateQuestions = (source, questionType) => {
    return source.filter(({ Content }) => {
      if (5 === questionType && Content.includes('<table')) return true
      // 过滤表格换行的
      // 过滤填空题、判断题没有填写区域的
      if ([2, 4].includes(questionType) && Content.includes('<\!--BA-->') && !Content.includes('<table')) return true

      if (questionType === 1) return true
    }).map(
      ({
        ID: sourceId,
        Cate: question,
        CateName: questionName,
        Content: content,
        Label: label,
        Points,
        Topics,
        Options: options,
        VIP: vip,
        Price: price,
        Answers: answers,
        FavCounte: favCount,
        ViewCount: viewCount,
        DownCount: downCount,
        Degree: degree,
        RealCount: realCount,
        PaperCount: paperCount,
        Date: date,
      }) => {
        let _content = []
        if (questionType === 5) {
          _content = extractTable(content);
        } else {
          _content = extractRadio(content);
          _content = [..._content].reduce((res, content) => {
            res.push(...extractImg(content));
            return res;
          }, []);
          _content = [..._content].reduce((res, content) => {
            res.push(...extractPlaceholder(content));
            return res;
          }, []);
        }

        const _options = options
          .reduce((res, content) => {
            res.push(extractImg(content));
            return res;
          }, [])
          .map((_) => generateContent(_));
        QuestionsMap[sourceId] = (QuestionsMap[sourceId] || 0) + 1
        return {
          bookId: '65b1d1264b32df6bd31f39a1',
          chapterId: '65b1d1274b32df6bd31f3b90',
          sourceId,
          question,
          questionName,
          content: generateContent(_content),
          label,
          options: _options,
          points: Points.map(({ Key }) => pointsMap[Key]),
          topics: Topics.map(({ Key }) => topicsMap[Key]),
          vip,
          price,
          activityPrice: 0,
          answers,
          favCount,
          viewCount,
          downCount,
          degree,
          realCount,
          paperCount,
          date: new Date(date),
        };
      },
    );
  };

  const nextPage = async (url, params = {}, pi = 1, ps = 10) => {
    const questions = [];
    const { TotalPage, Data } = await climbData('get', url, {
      params: {
        tp: 1,
        p3: '',
        dg: '0',
        rg: '',
        so: '',
        yr: '',
        ab: '',
        sc: '',
        gc: '',
        rc: '',
        yc: '',
        ec: '',
        er: '',
        po: '0',
        pd: '1',
        hot: '0',
        solutionNo: '',
        pi,
        ps,
        ...params,
      },
    });
    console.log(`成功爬取${(pi - 1) * 10}-${pi * 10}条数据！`)
    writeFile('./question.json', JSON.stringify(Data))
    questions.push(...generateQuestions(Data, params.ct));
    await saveDB('question/add', questions);
    console.log(`成功存储${(pi - 1) * 10}-${pi * 10}条数据！`)

    if (pi < TotalPage) {
      await sleep()
      await nextPage(url, params, pi + 1, ps)
      console.log(TotalPage, 'TotalPage')
    }
  };

  console.log('成功获取所有的选择题！')

  await nextPage('https://api.jyeoo.com//math3/AppTag/ListQues', {
    ct: 1,
    p1: 'afd13af0-1958-4812-8441-139d2934b40a', // bookId
    p2: 'b812b8ad-0457-4362-a477-2d67edf937c2', // 章节id
  });
  console.log('成功获取所有的填空题！')
  console.log(QuestionsMap)

  // 获取答案
  // const analyse = await axios.get('https://api.jyeoo.com//math3/AppTag/GetQues?id=dddcc7e1-983f-488a-a298-b32315df1ff0&s=0', {
  //   headers: {
  //     "Host": "api.jyeoo.com",
  //     "Connection": "keep-alive",
  //     "DeviceID": "orFmNtx0bJNuGlrVNdaUOOc3JA5s",
  //     "AppletSignature": "e6MJeX83hGElVn84U5{|Yn8n\\YYSW5P}VnH4f3E6]Zo7dZ7xdqooe5;x\\5<wiGH6PGT6RWT}Q}XzPGD?",
  //     "PlatformName": "AndroidPhone",
  //     "Authorization": "Token 9F5BBF8F752F060B00D38F7C81686852695A463CD5661FE0848CBEADB3ACFD5EB2A9A9D95B60C7D889407F339F7DEA92D3324FD32FF0B632AD11B6367F6206811C3461C9C4E538ED4A0FC66CD81BCA483B50BAC8E80F9D54D146F462D8197A43CDD5E420AFC26D7F6F3120F0756D16C3FD3D5E4E13FAD80F9DF19CB4AEAA99426EF575EF10CF0E625E0C9982C36F32C98F2E4D811F2247A6C57EA8E0D48EA589CF9F5E073F3959791C0BAC3934214151987F24ED26D250D1D968897CD2C1EAA20EF78EFE1166012908C96E27CF59EF3F6C4A7EAD4CD784BECBECF3650358E21BE9C530E43B0A7332F150893C5732EFC31DCA294B05220A0795D0BE6D751F8BE12C32B05E90A697B65C4914A6CBC8553A969D0E937A9AED5A4177FD1787069219556AE74C767E1FF62EEA9825FEC6492BD36DE725B198AF2D85A6963834DE7AEB5C3345840CB6113CDB25FC0B7FD52160467CA1D564A5D84216E9B7E608D0503076B026BED5ED03E5DEA743A33F767DF33DA4F3B658655D20",
  //     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090819) XWEB/8531",
  //     "Content-Type": "application/json",
  //     "xweb_xhr": "1",
  //     "Cookie": "jyean=NuXTxhCKmdr8yLV-mPVYiPpGVNXpmnExF2pZmfyrWrWUPDxiafKDqvd-R3oYXAS6Xb8MzQv3X7092LCpdyuelb2exJxLLqfTXengQcknpjBORvurVxB0zh00V7RhRPMq0;domain=jyeoo.com;expires=Wed;13-Mar-2024 19:22:48 GMT;path=/;HttpOnly;jy=B2C077D27C98581EFE0944175D3727ACECF04FD1CBE981449272EC19845C0FC9250293FF1D55E8DCDA700A5B64D1DED1255A5151A25D901733BB9A072DE8BA5B37425B8D5651B6A70E0A3C9FF96E45039263063B6FD78FB82C48E2D80EE56B0023CD59DB5C2F83EB230AD56B43FFC9B5B75B200BEB9B546057594FA545B3BAFFDF07241E344A09A4B56AA7DEB698863E391BBBF69C15D7F65B18A33ABA576F6DDED3A4E5344D8DCDDC7EC84EFA185C62DC45860C783C8283B13F6CC6394D0DF30549CD5551935400B7FAD3FD290E9934DE7B809950E5172C537A021618AA202A946EAD0554620A16FE2D0D7FEA85138B45586F50B9DA4A72DA118D44466609BDD0EEE0D54E23F5E5223FD7CC357B3EFC566109C3ED402F61EF71649AFEB1F21AB7F86AC4AD63A201A7AD326C8376B17812591D37F99F6839153FBA0B6230D71C552631ACF13698FA370F743868B8E1EFB6E078F35D2EDC51C4D05EA4586B34E2C66A8A620FC924E81638A4000DF6BA2B73D61F58283FF1FB7BA3DFC5636BBD9FDA997FA14272CF646CC4E55381E129DB707AD39E40F76298E719FB459EFD28D9FCDBB40D3E9ED00C4598A89F4533CC7A8D422DF63A2E8ECD116F34B35D6EA288C99E69F779388093982CB50D4BAA803AA3C6100F5971D650E35E27136A9EA1C86B7B581F0208F8434A5077887474241506F73403E2875BF4AF6691F5D6F2504BF8BDF8CBA41045C2A0E12B42364BA2F5EA4D4F3124D12C3E1A6748A1577A26284E8140FAF11CE7A93CCC8B291369AEE60A9A2955A533C5FFC8FCD015EE49F58B944F041428CD0E4FD0ADD0F1F9A47422B8271B0C8DBB011489F4019CB99E16D9E8DB8E2B1C74AA64BB918983C744E13891F1C092727C33594F68188774103C4A376848E7487CD0D7974FFB2CA0B131D93AB2C58F72B5B06F81A6E5B47DA7D3199DDF73D3E55A32B37B56B36DFEF7339B74BF5896C2FEB087E7527E63D12C616F2EEFDFCEA09912541EE49B7DDABE5EF5A2E1E27F91A0D8F9061CF1DAD234B33265DE74CB1941D0DC03622B6462EBF63815902CFE2230D0CE7FED589693E0CE5740749579E6C6E723C25F0965B3041D442347247951A3A02C4118E18C1A4996EA7DC34C973AFECD26A536BE2DDE382D12;domain=jyeoo.com;expires=Thu;11-Jan-2024 08:42:48 GMT;path=/;HttpOnly",
  //     "Accept": "*/*",
  //     "Sec-Fetch-Site": "cross-site",
  //     "Sec-Fetch-Mode": "cors",
  //     "Sec-Fetch-Dest": "empty",
  //     "Referer": "https://servicewechat.com/wxc1715f27089d2708/171/page-frame.html",
  //     "Accept-Encoding": "gzip",
  //     "Accept-Language": "zh-CN,zh;q=0.9"
  //   }
  // })

  // 相似题
  // const quesSame = await axios.get('https://api.jyeoo.com//math3/AppTag/QuesSame?id=4ecd5f8c-670f-4798-9e15-7070efdddf14', {
  //   headers: {
  //     "Host": "api.jyeoo.com",
  //     "Connection": "keep-alive",
  //     "DeviceID": "orFmNtx0bJNuGlrVNdaUOOc3JA5s",
  //     "AppletSignature": "e6MJeX83hGElVn84U5{|Yn8n\\YYSW5P}VnH4f3E6]Zo7dZ7xdqooe5;x\\5<wiGH6PGT6RWn4RWTzPGD?",
  //     "PlatformName": "AndroidPhone",
  //     "Authorization": "Token 9F5BBF8F752F060B00D38F7C81686852695A463CD5661FE0848CBEADB3ACFD5EB2A9A9D95B60C7D889407F339F7DEA92D3324FD32FF0B632AD11B6367F6206811C3461C9C4E538ED4A0FC66CD81BCA483B50BAC8E80F9D54D146F462D8197A43CDD5E420AFC26D7F6F3120F0756D16C3FD3D5E4E13FAD80F9DF19CB4AEAA99426EF575EF10CF0E625E0C9982C36F32C98F2E4D811F2247A6C57EA8E0D48EA589CF9F5E073F3959791C0BAC3934214151987F24ED26D250D1D968897CD2C1EAA20EF78EFE1166012908C96E27CF59EF3F6C4A7EAD4CD784BECBECF3650358E21BE9C530E43B0A7332F150893C5732EFC31DCA294B05220A0795D0BE6D751F8BE12C32B05E90A697B65C4914A6CBC8553A969D0E937A9AED5A4177FD1787069219556AE74C767E1FF62EEA9825FEC6492BD36DE725B198AF2D85A6963834DE7AEB5C3345840CB6113CDB25FC0B7FD52160467CA1D564A5D84216E9B7E608D0503076B026BED5ED03E5DEA743A33F767DF33DA4F3B658655D20",
  //     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090819) XWEB/8531",
  //     "Content-Type": "application/json",
  //     "xweb_xhr": "1",
  //     "Cookie": "jyean=NuXTxhCKmdr8yLV-mPVYiPpGVNXpmnExF2pZmfyrWrWUPDxiafKDqvd-R3oYXAS6Xb8MzQv3X7092LCpdyuelb2exJxLLqfTXengQcknpjBORvurVxB0zh00V7RhRPMq0;domain=jyeoo.com;expires=Wed;13-Mar-2024 19:22:48 GMT;path=/;HttpOnly;jy=B2C077D27C98581EFE0944175D3727ACECF04FD1CBE981449272EC19845C0FC9250293FF1D55E8DCDA700A5B64D1DED1255A5151A25D901733BB9A072DE8BA5B37425B8D5651B6A70E0A3C9FF96E45039263063B6FD78FB82C48E2D80EE56B0023CD59DB5C2F83EB230AD56B43FFC9B5B75B200BEB9B546057594FA545B3BAFFDF07241E344A09A4B56AA7DEB698863E391BBBF69C15D7F65B18A33ABA576F6DDED3A4E5344D8DCDDC7EC84EFA185C62DC45860C783C8283B13F6CC6394D0DF30549CD5551935400B7FAD3FD290E9934DE7B809950E5172C537A021618AA202A946EAD0554620A16FE2D0D7FEA85138B45586F50B9DA4A72DA118D44466609BDD0EEE0D54E23F5E5223FD7CC357B3EFC566109C3ED402F61EF71649AFEB1F21AB7F86AC4AD63A201A7AD326C8376B17812591D37F99F6839153FBA0B6230D71C552631ACF13698FA370F743868B8E1EFB6E078F35D2EDC51C4D05EA4586B34E2C66A8A620FC924E81638A4000DF6BA2B73D61F58283FF1FB7BA3DFC5636BBD9FDA997FA14272CF646CC4E55381E129DB707AD39E40F76298E719FB459EFD28D9FCDBB40D3E9ED00C4598A89F4533CC7A8D422DF63A2E8ECD116F34B35D6EA288C99E69F779388093982CB50D4BAA803AA3C6100F5971D650E35E27136A9EA1C86B7B581F0208F8434A5077887474241506F73403E2875BF4AF6691F5D6F2504BF8BDF8CBA41045C2A0E12B42364BA2F5EA4D4F3124D12C3E1A6748A1577A26284E8140FAF11CE7A93CCC8B291369AEE60A9A2955A533C5FFC8FCD015EE49F58B944F041428CD0E4FD0ADD0F1F9A47422B8271B0C8DBB011489F4019CB99E16D9E8DB8E2B1C74AA64BB918983C744E13891F1C092727C33594F68188774103C4A376848E7487CD0D7974FFB2CA0B131D93AB2C58F72B5B06F81A6E5B47DA7D3199DDF73D3E55A32B37B56B36DFEF7339B74BF5896C2FEB087E7527E63D12C616F2EEFDFCEA09912541EE49B7DDABE5EF5A2E1E27F91A0D8F9061CF1DAD234B33265DE74CB1941D0DC03622B6462EBF63815902CFE2230D0CE7FED589693E0CE5740749579E6C6E723C25F0965B3041D442347247951A3A02C4118E18C1A4996EA7DC34C973AFECD26A536BE2DDE382D12;domain=jyeoo.com;expires=Thu;11-Jan-2024 08:42:48 GMT;path=/;HttpOnly",
  //     "Accept": "*/*",
  //     "Sec-Fetch-Site": "cross-site",
  //     "Sec-Fetch-Mode": "cors",
  //     "Sec-Fetch-Dest": "empty",
  //     "Referer": "https://servicewechat.com/wxc1715f27089d2708/171/page-frame.html",
  //     "Accept-Encoding": "gzip",
  //     "Accept-Language": "zh-CN,zh;q=0.9"
  //   }
  // })
  // console.log(quesSame, 'quesSame')
})();
