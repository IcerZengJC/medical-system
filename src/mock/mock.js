// 引入mockjs
const Mock = require("mockjs");
// 获取 mock.Random 对象
const Random = Mock.Random;

const loginAccess = function() {
  return {
    code: "200",
    data: {
      account: [
        {
          username: "zjc",
          // userId: 1,
          password: "123456",
        },
        {
          username: "admin",
          // userId: 1,
          password: "123456",
        },
      ],
    },
    desc: "成功",
  };
};
const producePatientData = function() {
  let patients = [];
  for (let i = 0; i < 100; i++) {
    let newPatientObject = {
      code: i + 1,
      name: Random.cname(),
      gender: Random.pick(["男", "女"]),
      age: Random.integer(12, 80),
      idCard: Random.id(),
      depart: Random.pick(["急诊科", "女"]),
      doctor: Random.cname(),
      // thumbnail_pic_s: Random.dataImage("300x250", "mock的图片"), // Random.dataImage( size, text ) 生成一段随机的 Base64 图片编码
      // date: Random.date() + " " + Random.time(), // Random.date()指示生成的日期字符串的格式,默认为yyyy-MM-dd；Random.time() 返回一个随机的时间字符串
    };
    patients.push(newPatientObject);
  }
  return patients;
};
const produceDrugData = function() {
  let drugs = [];
  for (let i = 0; i < 200; i++) {
    let newDrugObject = {
      // 自增
      drugCode: (i + 1).toString(),
      drugName: Random.cword(2, 5), // Random.csentence( min, max )
      num: 1, // Random.integer(1, 5)
      unit: Random.pick(["瓶", "盒", "包"]),
      price: Random.integer(10, 200),
      contract: Random.pick(["医保", "自费"]),
    };
    drugs.push(newDrugObject);
  }
  return drugs;
};
// {
//   "updateTime": "2020-07-15T06:16:42.153Z",
//   "amount": 1084,
//   "selfPaying": 1009.8000000000001,
//   "code": 1,
//   "name": "郑强",
//   "age": 12,
//   "gender": "男",
//   "idCard": "310000197105212195",
//   "depart": "急诊室",
//   "doctor": "武丽",
//   "drugInfoList": [
//     {
//       "drugCode": "20",
//       "drugName": "经决果联非",
//       "num": 5,
//       "unit": "盒",
//       "price": 113,
//       "contract": "自费",
//       "amount": 565
//     }
//   ]
// }

const produceMedicalRecordData = function() {
  let records = [];
  for (let i = 0; i < 100; i++) {
    let drugInfoList = [];
    let totalAmount = 0;
    let totalSelfPaying = 0;
    // 买了 1-5 种药
    for (let index = 0; index < Random.integer(2, 7); index++) {
      let drugInfo = {
        drugCode: (index + 1).toString(),
        drugName: Random.cword(2, 5), // Random.csentence( min, max )
        num: Random.integer(1, 5), // 几瓶
        unit: Random.pick(["瓶", "盒", "包"]),
        price: Random.integer(10, 200),
        contract: Random.pick(["医保", "自费"]),
      };

      let discount = drugInfo.contract == "医保" ? 0.8 : 1;
      drugInfo.amount = drugInfo.num * drugInfo.price;
      drugInfo.selfPaying =
        Math.round(discount * drugInfo.num * drugInfo.price * 100) / 100;
      totalAmount += drugInfo.amount;
      totalSelfPaying += drugInfo.selfPaying;
      drugInfoList.push(drugInfo);
    }
    let newRecordObject = {
      // 自增
      code: i + 1,
      name: Random.cname(),
      gender: Random.pick(["男", "女"]),
      age: Random.integer(12, 80),
      idCard: Random.id(),
      depart: Random.pick(["急诊科", "耳鼻喉科", "内分泌科"]),
      doctor: Random.cname(),
      drugInfoList,
    };
    newRecordObject.amount = totalAmount;
    newRecordObject.selfPaying = totalSelfPaying;
    records.push(newRecordObject);
  }
  return records;
};

// Mock.mock( url, post/get , 返回的数据)；
Mock.mock("http://localhost:8888/api/login", loginAccess);
Mock.mock("http://localhost:8888/api/patient", producePatientData);
Mock.mock("http://localhost:8888/api/drug", produceDrugData);
Mock.mock("http://localhost:8888/api/medicalRecord", produceMedicalRecordData);
