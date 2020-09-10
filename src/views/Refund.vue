<template>
  <div>
    <el-row class="toolbar">

      <el-button type="success"
                 icon="el-icon-document"
                 size="medium"
                 @click="showPrint"
                 plain>退款</el-button>
      <!-- @click="save" -->
      <!-- :disabled="isPrepare" -->
      <el-button type="warning"
                 icon="el-icon-minus"
                 size="medium"
                 @click="clear"
                 plain>清屏</el-button>

      <el-button type="danger"
                 plain
                 size="medium"
                 @click="refundAll"
                 icon="el-icon-delete">
        全部退款</el-button>
      <el-button type="danger"
                 plain
                 size="medium"
                 @click="test"
                 icon="el-icon-delete">
        测试</el-button>
      <!-- :disabled="printable" -->
    </el-row>
    <el-container class="charge-form">
      <el-header height="60px">
        <el-row>
          <el-col :span="7">
            <el-autocomplete placeholder="输入病历号"
                             class="table-input"
                             :fetch-suggestions="searchPatient"
                             style="width: 320px"
                             type="text"
                             v-model="query.id"
                             @select="handleSelectPatientTips"
                             size="mini">
              <template slot="prepend">病历号</template>
              <template slot-scope="{ item }">
                <span style="font-size: 0.5rem">{{ item.id }}:{{ item.name }}</span>
              </template>
            </el-autocomplete>
          </el-col>
          <el-col :span="3">
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
            <el-input placeholder="就诊科室"
                      size="mini"
                      v-model="query.department.departName"
                      :disabled="true">
              <template slot="prepend">诊室</template>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-input placeholder="主任医师"
                      size="mini"
                      v-model="query.doctor.name"
                      :disabled="true">
              <template slot="prepend">医生</template>
            </el-input>
          </el-col>

          <el-col :span="1">
            <el-button type="primary"
                       plain
                       size="mini"
                       @click="searchRecord">查询</el-button>
          </el-col>
          <el-col :span="1">
            <el-button type="warning"
                       plain
                       size="mini"
                       @click="resetQuery">清空</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <!-- 退款操作表格 -->
        <el-table :data="tableData"
                  highlight-current-row
                  size="mini">
          <el-table-column type="index"
                           label="序号"
                           width="50">
          </el-table-column>
          <el-table-column prop="drug.id"
                           label="药品ID">
          </el-table-column>
          <el-table-column prop="drug.drugName"
                           label="药品名称">
          </el-table-column>
          <el-table-column prop="drug.unit"
                           label="单位">
          </el-table-column>
          <el-table-column prop="count"
                           label="购买数量">
          </el-table-column>
          <!-- <el-table-column prop="contract"
                           label="结算">
          </el-table-column> -->
          <el-table-column prop="drug.price"
                           label="单价">
          </el-table-column>
          <el-table-column prop="amount"
                           label="总价">
          </el-table-column>
          <!-- <el-table-column prop="selfPaying"
                           label="自费">
          </el-table-column> -->
          <el-table-column prop="refundAmount"
                           label="应退金额">
          </el-table-column>
          <el-table-column prop="refundNum"
                           :span="3"
                           label="退药数量">
            <template slot-scope="scope">
              <el-input-number size="mini"
                               v-model="scope.row.refundNum"
                               style="width: 100px"
                               :min="0"
                               :max="scope.row.count"></el-input-number>
              <!-- @change="calcRowRefund(scope.$index,scope.row.refundNum)" -->
            </template>
          </el-table-column>
          <el-table-column prop="surplusNum"
                           label="剩余数量">
          </el-table-column>
        </el-table>
      </el-main>
      <!-- 退款展示表格 -->
      <el-footer>
        <h4>退款信息</h4>
        <h5>
          退款总额: {{finalRefundAmount}} 元
        </h5>
        <el-table :data="dropData"
                  highlight-current-row
                  size="mini"
                  style="width: 98%;margin-left: 0.5rem">
          <el-table-column type="index"
                           label="序号"
                           width="50">
          </el-table-column>
          <el-table-column prop="drug.drugName"
                           label="退药名称"
                           width="180">
          </el-table-column>
          <el-table-column prop="drug.unit"
                           label="单位">
          </el-table-column>
          <el-table-column prop="refundNum"
                           label="退药数量">
          </el-table-column>
          <el-table-column prop="drug.price"
                           label="单价">
          </el-table-column>
          <el-table-column prop="refundAmount"
                           label="退款金额">
          </el-table-column>
        </el-table>
      </el-footer>
    </el-container>
    <!-- dialog 表格 -->
    <div v-if="printDialogShow">
      <el-dialog :visible.sync="printDialogShow">
        <div slot="title">
          <h3>药品收费收据</h3>
        </div>
        <div id="printContainer">
          <el-row>
            <el-col :span="12">
              <h4>姓名：{{query.name}}</h4>
            </el-col>
            <el-col :span="12">
              退款总额: {{finalRefundAmount}} 元
            </el-col>
          </el-row>
          <el-row>
            <p class="table-title">剩余药品</p>
          </el-row>
          <el-table :data="remainData"
                    highlight-current-row
                    size="mini">
            <el-table-column type="index"
                             label="序号"
                             width="50">
            </el-table-column>
            <el-table-column prop="drug.drugName"
                             label="药品名称">
            </el-table-column>
            <el-table-column prop="drug.unit"
                             label="单位">
            </el-table-column>
            <!-- <el-table-column prop="contract"
                             label="结算">
            </el-table-column> -->
            <el-table-column prop="count"
                             label="购买数量">
            </el-table-column>

            <el-table-column prop="refundNum"
                             :span="3"
                             label="退药数量">
            </el-table-column>
            <el-table-column prop="surplusNum"
                             :span="3"
                             label="剩余数量">
            </el-table-column>
            <el-table-column prop="drug.price"
                             label="单价">
            </el-table-column>

            <el-table-column prop="amount"
                             label="总价">
            </el-table-column>
          </el-table>
          <el-row>
            <p class="table-title">退款药品</p>
          </el-row>
          <div v-show="!dropData.length">
            暂无数据
          </div>
          <el-table v-show="dropData.length"
                    :data="dropData"
                    highlight-current-row
                    size="mini">
            <el-table-column type="index"
                             label="序号"
                             width="50">
            </el-table-column>
            <el-table-column prop="drug.drugName"
                             label="药品名称">
            </el-table-column>
            <el-table-column prop="drug.unit"
                             label="单位">
            </el-table-column>
            <!-- <el-table-column prop="contract"
                             label="结算">
            </el-table-column> -->
            <el-table-column prop="count"
                             label="购买数量">
            </el-table-column>
            <el-table-column prop="refundNum"
                             :span="3"
                             label="退药数量">
            </el-table-column>
            <el-table-column prop="surplusNum"
                             :span="3"
                             label="剩余数量">
            </el-table-column>
            <el-table-column prop="drug.price"
                             label="单价">
            </el-table-column>
            <el-table-column prop="amount"
                             label="总价">
            </el-table-column>
            <el-table-column prop="refundAmount"
                             label="应退">
            </el-table-column>
          </el-table>
        </div>
        <div slot="footer"
             class="dialog-footer">
          <el-button @click="showPrint"
                     size="mini">取 消</el-button>
          <el-button type="primary"
                     @click="refundRequest"
                     size="mini">确认退款</el-button>
          <!-- @click=""  -->
          <!-- @click="print" -->
        </div>
      </el-dialog>
    </div>
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
      searchPatientTimer: null,
      finalRefundAmount: 0
    }
  },
  created () {
    this.getDrugList()
    this.getPatientList()
  },
  computed: {
    remainData () {
      let temp = this.tableData.filter(item => item.refundNum != item.num)
      return temp
    },
    dropData () {
      //退款总额 重置为 0
      this.finalRefundAmount = 0
      let temp = this.tableData.filter(item => item.refundNum > 0)
      console.log("temp", temp)
      temp.forEach(ele => {
        console.log('dropData', ele)
        this.finalRefundAmount += ele.refundAmount
        console.log(this.finalRefundAmount)
      });
      return temp
    },
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
        if (e.contract == "医保") {
          // 两位小数
          charge.selfPaying += Math.round((0.8 * e.amount) * 100) / 100;
        } else {
          charge.selfPaying += e.amount;
        }
      });
      if (!isNaN(this.actual) && this.actual != 0) {
        charge.surplus = this.actual - charge.selfPaying;
      }
      return charge
    },

    chargeRequestDisable () {
      // 返回 disabled 是否可控
      return this.tableData.length && this.query.name ? false : true
    },
    currentData () {
      console.log('currentData')
      let temp = this.tableData.filter(item => {
        console.log(item)
        item.refundNum <= item.num
      })
      console.log('temp', temp)
      return temp
    },
  },
  watch: {
    tableData: {
      handler (newValue, oldValue) {
        // console.log("newValue", newValue)
        // console.log("oldValue", oldValue)
        newValue.forEach(data => {
          // refundAmount refundNum surplusNum
          this.$set(data, "surplusNum", data.count - data.refundNum)
          this.$set(data, "refundAmount", data.drug.price * data.refundNum)
        })
      },
      deep: true // 深度监视数组或者对象元素的变化
    },
  },
  methods: {
    test () {
      console.log("this.tableData", this.tableData)
      console.log('this.remainData', this.remainData)
      // console.log("this.patientTips", this.patientTips)
      // console.log("this.drugTips", this.drugTips)
    },

    clear () {
      this.query = {}
      this.tableData = []
    },
    deleteRow () {
      this.tableData = [];
      this.resetQuery()
    },
    refundAll () {
      let temp = this.tableData;
      temp.forEach(ele => {
        console.log(ele.count, ele.refundNum)
        ele.refundNum = ele.count
        console.log(ele.count, ele.refundNum)
        console.log('-')
      });
      this.tableData = []
      this.tableData = temp
      // console.log(this.tableData)
    },
    showPrint () {
      this.printDialogShow = !this.printDialogShow
    },
    /**
     * @description: 发送收费请求
     */
    refundRequest () {
      const h = this.$createElement
      this.$confirm('是否确认收费？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
      }).then(() => {
        // 关闭打印页
        this.showPrint()

        console.log(this.query.id)
        console.log('this.remainData', this.remainData)

        let temp = JSON.parse(JSON.stringify(this.remainData))
        temp.forEach(ele => {
          console.log(ele.count = ele.surplusNum)
        });

        this.$axios.put('/outpatient/out/' + this.query.id, { drugList: temp, recordId: this.query.id })
          .then(result => {
            // 发送请求 然后弹框
            if (result.data.message === '更新成功') {
              this.$message({
                type: 'success',
                message: '退款成功。',
              })
            } else {
              this.$message({
                type: 'error',
                message: '退款失败。',
              })
            }
            console.log('refundRequest', result.data)
          }).catch(err => {            {
              this.$message({
                type: 'info',
                message: '取消退款',
              })
            }
          })
      }).catch(err => {        {
          this.$message({
            type: 'info',
            message: '取消退款',
          })
        }
      })
    },
    handleCurrentChange (index) {
      // console.log("handleCurrentChange", index)
    },
    handleSelectPatientTips (table) {
      console.log('handleSelectPatientTips', table)
      console.log(this.query)
      this.query = table
    },
    // table drug信息
    handleSelectDrugTips (table) {
      console.log("handleSelectDrugTips")
      // let temp = this.tableData
      // 重构数组才能触发 computed 中的 charge 函数计算价格
      this.tableData[this.currentIndex] = table
      // this.tableData[index].amount
      // 计算单个药品总价
      this.$set(this.tableData[this.currentIndex], 'amount', table.count * table.price)
      // table.amount = table.count * table.price;
      // console.log(table.amount, table.count, table.price)
      // temp[this.currentIndex] = table;
      // this.tableData = temp;
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
      this.axios.get('/pub/record?page=1&pageSize=1000').then(res => {
        this.patientTips = res.data.data.list;
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
    searchRecord () {
      console.log("object", this.query.id)
      // /outpatient/out/1
      this.$axios.get("/outpatient/out/" + this.query.id)
        .then(res => {
          console.log('searchRecord', res.data.data.drugList)
          let temp = res.data.data.drugList;
          temp.forEach(ele => {
            console.log(ele)
            ele.amount = ele.count * ele.drug.price
            ele.refundNum = 0
            ele.refundAmount = 0
            ele.surplusNum = ele.count
          })
          this.tableData = temp
        })
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
  height: 300px;
}
.charge-form .el-main .add-btn {
  margin: 20px 0;
}

.charge-form .el-footer {
  background-color: #f2f6fc;
  padding: 0;
  padding: 10px 0;
}

.charge-form .el-footer .footer-title {
  padding: 10px 0;
}
.charge-form .el-footer .footer-text {
  color: red;
  font-size: 32px;
}
</style>