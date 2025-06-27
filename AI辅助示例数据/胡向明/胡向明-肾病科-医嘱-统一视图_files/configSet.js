const configSetting = {
  "urlPort": 'http://172.17.10.185:7013/hdr-civ',
  "urlPortHbase": 'http://172.17.10.185:9001',
  "operateConfig": {
    "showModual": "operate|anesthesia",//需要显示的模块，operate手术信息，anesthesia手术麻醉
    "active": "operate",//初始加载模块 operate或anesthesia
  },//手术模块配置
  "client_id": "user-service",
  "customPlug": "",
  "hospitalInfo": {//体检视图底部信息配置
    "phoneNumber": "0579-89979999；89935555", "seekPhoneNumber": "0579-89979999", "webUrl": "http://www.iim.zju.edu.cn/", "address": "浙江省义乌市商城大道N1号", "bus": "公交：3 路、36路、126路浙大附属医院( 楼西塘 )站，301 路、302路、310路到东付宅站"
  },
  "convertType":"HTML",// 病历文书将 \r\n 替换为 <br> 标签 ，配置需替换的类型，HTML、TEXT
  "showNextOrLastBtn":"Y",// 显示下一条、上一条按钮，N：不显示，Y：显示
  "showVisitListOrg":"Y",// 显示就诊列表院区名称，N：不显示，Y：显示
  "showPacsExe":"",//检查报告调PACS程序的类别，类别为空不显示该功能。
  "appointIeOpen":"",// 指定IE浏览器访问的弹出组件名称,多个逗号分隔（仅限检查报告模块）
  "arrowThemeColor":"",
  "oclUser":{
    "sourcePk":"ORDER_NO",
    "clientId":"ocl_admin",
    "clientSecret":"ocl_123456",
    "url":"http://172.17.10.185:9432/ocl/#/sharePage"
  },
  "emrExe":""
}
