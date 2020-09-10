<template>
  <div>
    <el-row class="toolbar">
      <el-dialog :visible.sync="printDialogShow">
        <div slot="title">
          <h3>药品收费收据</h3>
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
              {{drugData.drug.drugName||'无'}}
            </el-col>
            <el-col :span="4">
              {{drugData.drug.unit||'无'}}
            </el-col>
            <el-col :span="4">
              {{drugData.count||'无'}}
            </el-col>
            <el-col :span="4">
              {{drugData.drug.price||'无'}}
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
                 plain>确认收费</el-button>
      <!-- :disabled="isPrepare" -->

      <el-button type="warning"
                 icon="el-icon-minus"
                 size="medium"
                 @click="deleteRow"
                 plain>清屏</el-button>

      <el-button type="primary"
                 plain
                 size="medium"
                 icon="el-icon-printer"
                 @click="showPrint">
        打印发票</el-button>
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
      <el-main height="500px">
        <el-table :data="tableData"
                  style="width: 100%"
                  align="center"
                  @current-change="handleCurrentChange"
                  size="mini">
          <el-table-column type="index"
                           label="序号"
                           width="80 ">
          </el-table-column>
          <el-table-column prop="drug.drugCode"
                           label="药品编号">

          </el-table-column>
          <el-table-column prop="drug.drugName"
                           label="药品名称">
          </el-table-column>

          <el-table-column prop="drug.unit"
                           label="单位">

          </el-table-column>
          <el-table-column prop="count"
                           label="数量">
          </el-table-column>
          <el-table-column prop="drug.price"
                           label="单价">
          </el-table-column>
          <el-table-column prop="amount"
                           label="总价">
          </el-table-column>
        </el-table>

      </el-main>
      <el-footer height="100px">
        <el-row :offset="6">
          <el-col :span="23">
            <el-row style="height: 40px;line-height: 40px;"
                    type="flex"
                    justify="space-around">
              <el-col :span="8">
                <el-input placeholder="自费金额"
                          size="mini"
                          v-model="charge.selfPaying"
                          :disabled="true">
                  <template slot="prepend">自费</template>
                </el-input>
              </el-col>
              <el-col :span="8">
                <el-input placeholder="总额"
                          size="mini"
                          v-model="charge.amount"
                          :disabled="true">
                  <template slot="prepend">总额</template>
                </el-input>
              </el-col>
            </el-row>
            <el-row style="height: 40px;line-height: 40px"
                    type="flex"
                    justify="space-around">
              <el-col :span="8">
                <el-input placeholder="实收现金"
                          size="mini"
                          v-model="actual">
                  <template slot="prepend">实收</template>
                </el-input>
              </el-col>
              <el-col :span="8">
                <el-input :disabled="true"
                          placeholder="找零"
                          size="mini"
                          v-model="charge.surplus">
                  <template slot="prepend">找零</template>
                </el-input>
              </el-col>
            </el-row>
            <div class="grid-content bg-purple-light"></div>
          </el-col>
        </el-row>
      </el-footer>
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
  },
  methods: {
    test () {
      console.log("this.tableData", this.tableData)
      // console.log("this.patientTips", this.patientTips)
      // console.log("this.drugTips", this.drugTips)
    },
    deleteRow () {
      this.tableData = [];
      this.resetQuery()
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
     * @description: 发送收费请求
     */
    chargeRequest () {
      const h = this.$createElement
      this.$confirm('是否确认收费？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
      }).then(() => {
        console.log(this.query.id)
        this.$axios.put('/outpatient/out', { id: this.query.id })
          .then(result => {
            console.log('result', result)
            // 发送请求 然后弹框
            if (result.data.message === '修改成功') {
              this.$message({
                type: 'success',
                message: '收费成功',
                showClose: true,
                center: true
              })
            } else {
              this.$message({
                type: 'error',
                message: '修改失败。',
              })
            }
            // console.log('chargeRequest', result.data)
          })
      }).catch(e => {
        this.$message({
          type: 'info',
          message: '取消收费',
        })
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
      this.axios.get('/pub/record?page=1&pageSize=1000&requiredPayStatus=0').then(res => {
        // this.axios.get('/pub/record?page=1&pageSize=1000').then(res => {
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
          })
          this.tableData = temp
        }).catch(err => {
          this.$message({
            type: "info",
            message: '无此病历号处方信息'
          })
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
  min-height: 430px;
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