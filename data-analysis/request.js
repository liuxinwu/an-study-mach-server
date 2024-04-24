import axiox from 'axios';

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
    const {
      status,
      message = '接口异常',
      data,
    } = await axiox[method](url, {
      headers: {
        host: 'api.jyeoo.com',
        deviceid: 'orFmNt_EwSopa1tSVcHfETgwFcA8',
        appletsignature:
          'e6MJeX83[3Y6X5<z\\WI3X4]mVJ]IYJg6UpQERHE6]Zo7dZ7xdqooe5;x\\5<wiGH6PWP7QWj7RGjzPGD?',
        platformname: 'AndroidPhone',
        authorization:
          'Token 9F5BBF8F752F060B00D38F7C81686852695A463CD5661FE0848CBEADB3ACFD5E36A5EED7E92753D354330640B82D3776BD06515181F6D7C00577EAF289D71B1923CB203D8774982940C502891C1858D15772CD417599F130DEFC2D12EC394885F94B42CEC55F917380F840C5C4D678E587B3CCC3C0F2A1BD9D062E992F7F82A5DC9C27E1EC78F3D8AC583F440468818E1DF6C31F773A1D031EFADF537F9D1623',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x6309092b) XWEB/9079',
        'content-type': 'application/json',
        xweb_xhr: '1',
        cookie:
          'jyean=eYDQlM62Xhypu2Vpt-kqCvnekDELOTgR-9zeHG0gWv3Mjlo6C3Ec3jUUup5INw1c-xY0uVcgHkJRMtwPod8hP44liC28ytNttI_l8rToh9hd2UsHBH6KSAN71lAiXwwg0; domain=jyeoo.com; expires=Sun; 30-Jun-2024 18:57:25 GMT; path=/; HttpOnly; jy=D3B26EEF9586E15193152EFABC03183D4FD0CC94CA141C750FBDFE0ED21530C4DF137F0BFD05502BF9D75B7AA80DF4F6657FD327B01AE5D5640D101043F665F6777BE252E9CE662B03B0C8198C6D697AC130F87138E57A01D3D913CA658FA20F5003033D2F7CFACD42EA7B6E288E7B490633A91FDA1E83FC769DBFF644119697697E6982D1468E94F22093816C8BC675EA956D7C50FA91B0D6FB99EB076533FCCD8DEB1647793D48AC032F6145AAAE51DC1FAF45C8891812856BB23DD18C815F761051BB5969123187204C24E4D362A5D9BA01F1E080CC6A49FC2D84404252E56C84A131438E920E6E563BC65821DE6D74558ED072B56A720F2CB4EB2CF462C3F9AC0F267AFB626C43EA042F301E3BC51B110038B0A94166BDC6CBDBEC10288891E343F41BDDB8E0330195D0BCDB94C74B53EBC780573626323595703DADF4D541DADEECB2A9251042C35ADBB0A685FBAFDCF5F243DA457F1A56E589D6FB1BF4CEA1BF7932150A2B2FBC8B4938DC432ACEAFB7AD0E90786FDB15BF0CBA0B75A7DE5B69D9A4D36972BDE4724286E03BF7; domain=jyeoo.com; expires=Mon; 29-Apr-2024 08:17:25 GMT; path=/; HttpOnly',
        accept: '*/*',
        'sec-fetch-site': 'cross-site',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        referer:
          'https://servicewechat.com/wxc1715f27089d2708/179/page-frame.html',
        'accept-encoding': 'gzip',
        'accept-language': 'zh-CN,zh;q=0.9',
        Connection: 'close',
      },
      ...body,
    });
    if (status !== 200) return Throw(Error(message));
    resovle(data);
  });
};

export const urlPre = 'http://127.0.0.1:3000/';
export const saveDB = (url, body) => {
  return new Promise(async (resolve, reject) => {
    const {
      status,
      message = '接口异常',
      data,
    } = await axiox.post(`${urlPre}${url}`, body);

    if (status !== 201) return Throw(Error(message));
    resolve(data);
  });
};

export const getData = (url, body) => {
  return new Promise(async (resolve, reject) => {
    const {
      status,
      message = '接口异常',
      data,
    } = await axiox.get(`${urlPre}${url}`, body);

    // if (status !== 201) return Throw(Error(message))
    resolve(data);
  });
};
