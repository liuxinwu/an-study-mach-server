import axiox from 'axios'


// axiox.interceptors.response.use(function (response) {
//   // 对响应数据做点什么
//   return response;
// }, function (error) {
//   // 对响应错误做点什么
//   return Promise.reject(error);
// });

/**
 * 爬数据
 * @param {String} method 请求方法
 * @param {String} url 接口地址
 * @param {Object} data 参数
 * @returns 数据
 */
export const climbData = (method, url, body) => {
  return new Promise(async (resovle, reject) => {
    const { status, message = '接口异常', data } = await axiox[method](url, {
      headers: {
        "Host": "api.jyeoo.com",
        "Connection": "keep-alive",
        "DeviceID": "orFmNtx0bJNuGlrVNdaUOOc3JA5s",
        "AppletSignature": "e6MJeX83hGElVn84U5{|Yn8n\\YYSW5P}VnH4f3E6]Zo7dZ7xdqooe5;x\\5<wiGH6PGX5QG\\6PmXzPGD?",
        "PlatformName": "AndroidPhone",
        "Authorization": "Token 9F5BBF8F752F060B00D38F7C81686852695A463CD5661FE0848CBEADB3ACFD5ED1BFFC1F8D89C9FAC31811E9014BC8F6F19A28D19A9E618160D6EAEF94B6E0FADE5CEE8C1FCFAB4C404598C95CA4EC32D973E0110EE818C8F1508699A954958239CB8EAA982BA551044D5BD2F43C59121572CC1DA6B39C242D35DF4B714994488ECA00A54688BE97010159406A5E8A880CCEB263FC3047665159D16261CF072A",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090819) XWEB/8531",
        "Content-Type": "application/json",
        "xweb_xhr": "1",
        "Cookie": "jyean=VmL3IqN4MDsM5SMCLtlrcI0ftA1xpawHDahgzthwC7qqU62Zcfmnhli8nvIUENqCtw7SX6u4zjcARVg8weJDDglDfhEI4_G7gCO--nSH6VFDnynX0bzb4BDXaqKCb_Yq0;domain=jyeoo.com;expires=Wed;27-Mar-2024 20:51:57 GMT;path=/;HttpOnly;jy=F79DC3F808DFC8BBB0E387C0C45AA03A0E449D80C900FAD6FB1510B06F01A0D322A8692767B6B2B0EE55552534CB5BB931AE1F3DC1333A45092569A0DCFAC1778B856D36A37745B3CC7DEFB22F26446EDEB2E7791105D0174A9C8035B29386918A5AD9C560B5A396B182F2029BB21F8143C409BE61482030A465462CA36A9F66F03E0DAE2962D1F8B58D5E0287F02C1B2887AA29AC2568199ACE91678B59C98CF6EAA637010002DDA5C22CDD796DF438989935BCDD969416FF340E62587C4AA77F2EB4E77031F3184CF192C11EB79BEEC0BC0E178BBC88613FEBAF82CE7F5DE0127A561EB0F047909547293F90A1239E7C07E16E17DBB13C633F5B7D74297126AA259A2DB5779914A7CBDC665040C1D52938897D91C971B2B7FB288D9F7A3C1B1C68187D4AE508B47032197455C557AAFCCA9D5F10A85BE733151024F3C099E85414BBA01DC11B0483B767E342AF9EE3AF278FC54C12C5D4D597D38EFD785A0888592DA5B6D712917CC197FA71DD16873B92FC2F2A27557058D97CF95C9669510AE2079B900E005CD3A202ABBC55B49F;domain=jyeoo.com;expires=Thu;25-Jan-2024 10:11:57 GMT;path=/;HttpOnly",
        "Accept": "*/*",
        "Sec-Fetch-Site": "cross-site",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "Referer": "https://servicewechat.com/wxc1715f27089d2708/171/page-frame.html",
        "Accept-Encoding": "gzip",
        "Accept-Language": "zh-CN,zh;q=0.9"
      },
      ...body
    })
    if (status !== 200) return Throw(Error(message))
    resovle(data)
  })
}


export const urlPre = 'http://127.0.0.1:3000/'
export const saveDB = (url, body) => {
  return new Promise(async (resolve, reject) => {
    const { status, message = '接口异常', data } = await axiox.post(`${urlPre}${url}`, body)

    if (status !== 201) return Throw(Error(message))
    resolve(data)
  })
}

export const getData = (url, body) => {
  return new Promise(async (resolve, reject) => {
    const { status, message = '接口异常', data } = await axiox.get(`${urlPre}${url}`, body)

    // if (status !== 201) return Throw(Error(message))
    resolve(data)
  })
}