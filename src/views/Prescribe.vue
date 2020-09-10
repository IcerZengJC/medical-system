<template>
  <div>
    <el-row class="toolbar">
      <el-dialog :visible.sync="printDialogShow">
        <div slot="title">
          <h3>药品开方数据</h3>
        </div>
        <div id="printContainer">
          <!-- {{query.name}} -->
          <el-row>
            <h4>姓名：{{query.name}}</h4>
          </el-row>
          <el-row>
            <el-col :span="12">
              总金额：{{charge.amount}}元
            </el-col>
            <el-col :span="12">
              自费金额：{{charge.selfPaying}}元
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="12">
              医保垫付：{{charge.amount - charge.selfPaying}}元
            </el-col>
            <el-col :span="12">
              支付方式：{{this.query.contract}}
            </el-col>
          </el-row>
          <el-row class="table-title">
            <el-col :span="4"
                    :offset="2">
              名称
            </el-col>
            <el-col :span="4">
              单位
            </el-col>
            <el-col :span="4">
              数量
            </el-col>
            <el-col :span="4">
              单价
            </el-col>
            <el-col :span="4">
              总价
            </el-col>
          </el-row>
          <el-row class="table-value"
                  v-bind:key="drugData.drugName"
                  v-for="drugData in tableData">
            <el-col :span="4"
                    :offset="2">
              {{drugData.drugName||'无'}}
            </el-col>
            <el-col :span="4">
              {{drugData.unit||'无'}}
            </el-col>
            <el-col :span="4">
              {{drugData.count||'无'}}
            </el-col>
            <el-col :span="4">
              {{drugData.price||'无'}}
            </el-col>
            <el-col :span="4">
              {{drugData.amount||'无'}}
            </el-col>
          </el-row>
        </div>
        <div slot="footer"
             class="dialog-footer">
          <el-button @click="showPrint"
                     size="mini">取 消</el-button>
          <el-button type="primary"
                     @click="print"
                     size="mini">打印</el-button>
        </div>
      </el-dialog>
      <el-button type="success"
                 icon="el-icon-document"
                 size="medium"
                 :disabled="chargeRequestDisable"
                 @click="chargeRequest"
                 plain>开具处方</el-button>
      <!-- @click=" pepareCommit" -->
      <!-- :disabled="isPrepare" -->
      <el-button type="warning"
                 icon="el-icon-minus"
                 size="medium"
                 @click="clear"
                 plain>清屏</el-button>

      <el-button type="primary"
                 plain
                 size="medium"
                 icon="el-icon-printer"
                 @click="showPrint">
        打印处方</el-button>
      <el-button type="primary"
                 plain
                 size="medium"
                 icon="el-icon-printer"
                 @click="test">
        测试</el-button>

    </el-row>

    <el-container class="charge-form"
                  style="height: 100%;width:100%">
      <el-header height="60px">
        <el-row>
          <el-col :span="5">
            <el-autocomplete placeholder="输入病历号"
                             class="table-input"
                             :fetch-suggestions="searchPatient"
                             style="width: 320px"
                             type="text"
                             v-model="query.id"
                             @change="handleCurrentPatient"
                             @select="handleSelectPatientTips"
                             size="mini">
              <template slot="prepend">病历号</template>
              <template slot-scope="{ item }">
                <span style="font-size: 0.5rem">{{ item.id }}:{{ item.name }}</span>
              </template>
            </el-autocomplete>
          </el-col>
          <el-col :span="2">
            <el-input placeholder="患者姓名"
                      size="mini"
                      v-model="query.name"
                      :disabled="true">
              <template slot="prepend">姓名</template>
            </el-input>
          </el-col>
          <el-col :span="2">
            <el-input placeholder="性别"
                      size="mini"
                      v-model="query.gender"
                      :disabled="true">
              <template slot="prepend">性别</template>
            </el-input>

          </el-col>
          <el-col :span="2">
            <el-input placeholder="患者年龄"
                      size="mini"
                      v-model="query.age"
                      :disabled="true">
              <template slot="prepend">年龄</template>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-input placeholder="合作单位"
                      size="mini"
                      v-model="query.contract"
                      :disabled="true">
              <template slot="prepend">合作单位</template>
            </el-input>
          </el-col>
          <el-col :span="2">
            <el-input placeholder="就诊科室"
                      size="mini"
                      v-model="query.department.departName"
                      :disabled="true">
              <template slot="prepend">诊室</template>
            </el-input>
          </el-col>
          <el-col :span="2">
            <el-input placeholder="主任医师"
                      size="mini"
                      v-model="query.doctor.name"
                      :disabled="true">
              <template slot="prepend">医生</template>
            </el-input>
          </el-col>

          <!-- <el-col :span="1">
            <el-button type="primary"
                       plain
                       size="mini"
                       @click="searchPatient">查询</el-button>
          </el-col> -->
          <el-col :span="1">
            <el-button type="warning"
                       plain
                       size="mini"
                       @click="resetQuery">清空</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main height="500px">
        <el-table :data="tableData"
                  style="width: 100%"
                  align="center"
                  size="mini">
          <el-table-column type="index"
                           label="序号"
                           width="80 ">
          </el-table-column>
          <el-table-column prop="drugCode"
                           label="药品编号">
            <template slot-scope="scope">
              <!-- @select="codeSelect(scope)" -->
              <el-autocomplete placeholder="输入编码"
                               class="table-input"
                               :fetch-suggestions="searchDrug"
                               style="width: 100px"
                               type="text"
                               @select="handleSelectDrugTips"
                               @focus="handleTableIndex(scope.$index)"
                               v-model="scope.row.drugCode"
                               size="mini">
                <template slot-scope="{ item }">
                  <span style="font-size: 0.5rem">{{ item.drugCode }}:{{ item.drugName }}</span>
                </template>
              </el-autocomplete>
            </template>
          </el-table-column>
          <el-table-column prop="drugName"
                           label="药品名称">
          </el-table-column>

          <el-table-column prop="unit"
                           label="单位">

          </el-table-column>
          <el-table-column prop="count"
                           label="数量">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.count"
                               placeholder="输入数量"
                               @change="handleChangePrice(scope.$index)"
                               @focus="handleTableIndex(scope.$index)"
                               style="width: 100px"
                               size="mini"
                               :min="1"
                               :max="10">
              </el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="price"
                           label="单价">
          </el-table-column>
          <el-table-column prop="amount"
                           label="总价">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini"
                         type="danger"
                         plain
                         @click="deleteRow(scope.$index)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button class="add-btn"
                   type="danger"
                   size="mini"
                   icon="el-icon-plus"
                   circle
                   @click="createRow()"> </el-button>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isPrepare: true,
      query: {
        id: '',
        name: '',
        gender: '',
        age: null,
        // idCard: '',
        // depart: '',
        department: {
          deartName: '',
        },
        doctor: {
          name: '',

        },
      },
      gender: ['男', '女'],
      tableData: [],
      statistic: {
        amount: 0,
        count: 0
      },
      actual: 0,
      drugTips: [],
      patientTips: [],
      timeout: null,
      currentIndex: null,
      currentRow: null,
      printDialogShow: false,
      searchPatientTimer: null
    }
  },
  created () {
    this.createRow()
    this.getDrugList()
    this.getPatientList()
  },
  computed: {
    charge () {
      let charge = {
        selfPaying: 0,
        amount: 0,
        surplus: 0
      }
      // 待获取数据并计算数据
      this.tableData.forEach(e => {
        // 总额
        charge.amount += e.amount
        // if (e.contract != "无") {
        //   // 两位小数
        //   charge.selfPaying += Math.round((0.8 * e.amount) * 100) / 100;
        // } else {
        //   charge.selfPaying += e.amount;
        // }
      });
      if (this.query.contract != "无") {
        // 两位小数
        charge.selfPaying = Math.round((0.8 * charge.amount) * 100) / 100;
      }
      if (!isNaN(this.actual) && this.actual != 0) {
        charge.surplus = this.actual - charge.selfPaying;
      }
      return charge
    },
    chargeRequestDisable () {
      // 返回 disabled 是否可控
      return this.tableData.length && this.query.name ? false : true
    },
  },
  methods: {
    test () {
      console.log("this.patientTips", this.patientTips)
      console.log("this.drugTips", this.drugTips)
      console.log('query', this.query)
      console.log('tableData', this.tableData)
      // console.log('tableData', this.m)
    },
    createRow () {
      let table = {
        drugCode: '',
        drugName: '',
        count: 0,
        unit: '',
        price: 0,
        amount: 0,
        contract: '',
      }
      table.amount = table.count * table.price;
      this.tableData.push(table)
    },
    clear () {
      this.tableData = [];
      this.resetQuery()
    },
    deleteRow (index) {
      this.tableData.splice(index, 1)
    },
    showPrint () {
      this.printDialogShow = !this.printDialogShow
    },
    /**
     * @description: 调用打印功能
     */
    print () {
      document.body.innerHTML = document.getElementById('printContainer').innerHTML
      window.print()
      window.location.reload()
      return false
    },

    /**
     * @description: 发送开方请求
     */
    chargeRequest () {
      const h = this.$createElement
      this.$confirm('是否确认开方？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
      }).then(() => {
        // this.pepareCommit()
        console.log('query', this.query)
        console.log('tableData', this.tableData)
        let amount = 0
        this.tableData.forEach(ele => {
          amount += ele.amount
        });

        let drugList = []
        this.tableData.forEach(ele => {
          let drug = {
            drugId: ele.id,
            recordId: this.query.id,
            count: ele.count
          }
          drugList.push(drug)
        });
        // 整合开方数据
        let temp = {
          recordId: this.query.id,
          amount,
          drugList
        }
        console.log('temp', temp)
        // 提交开方请求
        this.$axios.post('/doctor/prescription', temp)
          .then(res => {
            console.log(res.data)
            if (res.data.message == '添加成功') {
              this.$message({
                type: 'success',
                message: h('h4', { style: 'color: teal' }, '开方成功。'),
                showClose: true,
                center: true
              })
            } else {
              this.$message({
                type: 'warning',
                message: h('h4', { style: 'color: teal' }, '开方失败，请重试'),
                showClose: true,
                center: true
              })
            }
          }).catch((error) => {
            this.$message({
              type: 'danger',
              message: '请求异常'
            });
          });
      }).catch((error) => {
        this.$message({
          type: 'info',
          message: '取消开方'
        });
      });
    },
    handleSelectPatientTips (table) {
      // console.log('handleSelectPatientTips', table)
      // console.log(this.query)
      this.query = JSON.parse(JSON.stringify(table))
    },
    handleCurrentPatient () {
      console.log("object")
    },
    // table drug信息
    handleSelectDrugTips (table) {
      console.log("handleSelectDrugTips")
      this.tableData[this.currentIndex] = table
      // 计算单个药品总价
      this.$set(this.tableData[this.currentIndex], 'amount', table.count * table.price)
      // 重构数组才能触发 computed 中的 charge 函数计算价格
      this.tableData.push({})
      this.tableData.pop()
    },
    handleTableIndex (index) {
      this.currentIndex = index;
    },
    handleChangePrice (index) {
      // 当前table 的 index
      this.currentIndex = index
      let table = this.tableData[index]
      this.handleSelectDrugTips(table)
    },
    getDrugList () {
      this.axios.get('/pub/drug?page=1&pageSize=1000').then(res => {
        console.log(res.data.data.list)
        this.drugTips = res.data.data.list;
        this.drugTips.forEach(ele => {
          ele.count = 1
        });
        // console.log(this.drugTips)
      }).catch(err => {
        console.log("getDrugList error");
      });
    },
    getPatientList () {
      this.axios.get('/pub/record?page=1&pageSize=1000&requiredPayStatus=0').then(res => {
        // this.axios.get('/pub/record?page=1&pageSize=1000').then(res => {
        this.patientTips = res.data.data.list;
        console.log('this.patientTips', this.patientTips)
      }).catch(err => {
        console.log("getPatientList error");
      });
    },
    // 搜索药品，筛选提示列表
    searchDrug (queryString, cb) {
      var drugTips = JSON.parse(JSON.stringify(this.drugTips));
      var results = queryString ? drugTips.filter(this.createDrugFilter(queryString)) : drugTips;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        // 调用 callback 返回建议列表的数据
        cb(results);
      }, 1000);
    },
    // filter条件
    createDrugFilter (queryString) {
      return (drug) => {
        return (drug.drugCode.indexOf(queryString) === 0);
      };
    },
    // 搜索病人，筛选提示列表
    searchPatient (queryString, cb) {
      var patientTips = JSON.parse(JSON.stringify(this.patientTips));
      console.log(queryString, patientTips)
      var results = queryString ? patientTips.filter(this.createPatientFilter(queryString)) : patientTips;
      if (queryString == '') { this.resetQuery() }
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        // 调用 callback 返回建议列表的数据
        cb(results);
      }, 1000);
    },
    // filter条件
    createPatientFilter (queryString) {
      return (patient) => {
        return (patient.id.indexOf(queryString) === 0);
      };
    },
    /**
     * @description: 重置 query
     * @param : code 保存输入的 code
     */
    resetQuery () {
      this.query = {
        id: '',
        name: '',
        gender: '',
        age: null,
        // idCard: '',
        // depart: '',
        department: {
          deartName: '',
        },
        doctor: {
          name: '',
        },
      }
    },
  }
}
</script>

<style>
.toolbar {
  padding: 15px 10px;
  border-bottom: 1px solid #0002;
}
.toolbar .el-button {
  float: left;
}
.toolbar .el-dialog__body {
  padding: 20px 10px;
}
.toolbar .el-dialog__footer {
  padding: 20px;
}
.toolbar .dialog-footer {
  display: flex;
  justify-content: center;
}
.toolbar .table-title {
  margin-top: 20px;
}
.toolbar .table-value {
  margin-top: 10px;
}
.charge-form .el-col {
  margin-left: 10px;
}
.charge-form .el-header {
  line-height: 60px;
  background-color: #f2f6fc;
}
.charge-form .el-input-group__prepend {
  padding: 0 10px;
}
.charge-form .el-select > .el-input .el-input__inner {
  padding: 10px;
}
.charge-form .el-main {
  padding-top: 20px;
  padding: 20px 20px 0;
  min-height: 430px;
}
.charge-form .el-main .add-btn {
  margin: 20px 0;
}
</style>