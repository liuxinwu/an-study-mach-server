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
        'Host': 'api.jyeoo.com',
        'Connection': 'keep-alive',
        'DeviceID': 'orFmNt8AIvyq7PgGO-5J7fqkhLqE',
        'AppletSignature': 'f6s7dJs8PGIDhKorOpQye[z{Q}D5PmTzQmf7PGDy',
        'PlatformName': 'AndroidPhone',
        'Authorization': 'Token 9F5BBF8F752F060B00D38F7C81686852695A463CD5661FE0848CBEADB3ACFD5EDB8C0F8A64880471035119DBB7CA567B9973A27B7C8A8658C4658C3CBCED03E9A7B2C1124A4A456F7D8565D4F1CD5D507DE7FC214BE18AB2D01A61B4FBF4A90871140BDE092C0D0E6881D0D3F804F58EB9B892F7058ABDC34BA50EBA15BC9EF7100ED51D1A67707A331ED0E4E41C444C56A6FDA8B9E7E6C5BB64FC815021D32BF9BC7233D0B8E616A8E7B4FA9E9EAAD7',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 MicroMessenger/6.8.0(0x16080000) NetType/WIFI MiniProgramEnv/Mac MacWechat/WMPF MacWechat/3.8.6(0x13080610) XWEB/1156',
        'Content-Type': 'application/json',
        'xweb_xhr': 1,
        'Cookie': 'jyean=8jq1qw2W9-_D2VSaALluvyjO-gibb_BjmuJS2nbRC4mk_9ct7wB40DcXdllF-1SctNE0ppmzfBiXIyVUD9UU5sF1uFOBlhoB407BxoZz2EdHpeumxABRCUJYOhQtapou0;domain=jyeoo.com;expires=Mon;01-Apr-2024 14:01:37 GMT;path=/;HttpOnly;jy=3035D61C2170CB1943069A32A10ABE9CFC03C50AE63D1B44AB24ACFF7EA06DC419C4C2011C34D5C0CFCB8C8969750F367A76F6682308D615C82586EC2B738C0A97D7AEE63E1E7F2BAE45156D59B9702A427F71DD48F693E63B0D217125BEFDEF85659754AD9F66B82A49432FCAEFE7ACED6941D41464C592A2FE460C62AEE344CE7851A32B14E9244394B5D527CAD7FA5341738753341F70C90237C3D8096A061DF62E4F4561986A28071B20FD4CD5FC8C54C04C300E2A787E83DD137062915DE5227D25871978FF06B73BEC3D316593FC86AE0F9C657E557F9C40D54B72F9F81F1AAF777949CA73E3C745FB29F8B450FD3B6C1C878BEC1BAA62B6C8890F58D86DDE0F002BA2C45ABC968EAD8E064B856CDB16E3520FAA264B06BD13EB81D7D3FD18F1F78977EA8EEF46D2CCD59506081E2BFC6029372FB832EE768513F0E80F83C251231F9A8713841044C2DDC545A4CF72DA4A8B90C5E17EA70B7D877AB4D2FB389324C8FDAF55943BBD2750B2FADB5A10DE65D50C23B94751DC2036DE229621371249BF7581D4B680716B859AA788862A8646BE246DCB52217DFC567D8A82F054EE614C6CD2FA574B0A8A93FD2D0F;domain=jyeoo.com;expires=Tue;30-Jan-2024 03:21:37 GMT;path=/;HttpOnly',
        'Accept': '*/*',
        'Sec-Fetch-Site': 'cross-site',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        'Referer': 'https://servicewechat.com/wxc1715f27089d2708/171/page-frame.html',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.9',
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