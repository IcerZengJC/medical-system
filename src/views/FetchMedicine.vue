<!--
 * @Description: 
 * @Author: Zjc
 * @Date: 2020-07-21 16:21:40
 * @LastEditTime: 2020-07-21 16:21:40
 * @LastEditors: Do not edit
--> 
<template>
  <div class="fetch-medicine">
    <h3 style="line-height:40px;padding-bottom:50px">取药窗口
      <el-button type="primary"
                 plain=""
                 style="float:right;"
                 size="mini"
                 @click="test">查看信息</el-button>
    </h3>
    <div v-if="isShow">
      <el-collapse v-model="activeNames"
                   @change="handleChange">
        <el-collapse-item v-for="(item,index) in prescriptionList"
                          :key="index"
                          :title="'姓名：'+(item.patient.name||'qq')"
                          :name="index">
          <div v-for="(ele,idx) in item.drugList"
               :key="idx">
            <el-row>
              <el-col :span="6">药品名：{{ele.drug.drugName}}</el-col>
              <el-col :span="6">药品数量：{{ele.count}}</el-col>
              <el-col :span="6">药品代号：{{ele.drug.drugCode}}</el-col>
              <el-col :span="6">药品单位：{{ele.drug.unit}}</el-col>
            </el-row>
          </div>
          <!-- <div>recordId:{{item.recordId}}</div> -->
          <!-- <div>id:{{item.drug.id}}</div> -->
        </el-collapse-item>
      </el-collapse>
    </div>
    <div v-if="!isShow">点击按钮查看数据</div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      activeNames: [0],
      prescriptionList: [

      ],
      list: [],
      isShow: false
    };
  },
  methods: {
    handleChange (val) {
      console.log(val);
      this.list = val
    },
    getPrescriptionList () {
      this.$axios.get('/drug/prescription')
        .then(res => {
          console.log('getPrescriptionList')
          console.log(res.data)
          this.prescriptionList = res.data.data

          this.prescriptionList.forEach(element => {
            // console.log('element', element)

            this.$axios.get('/pub/record/' + element.recordId)
              .then(res => {
                element.patient = res.data.data
              })
          });
          this.$forceUpdate()
        })
    },

    test () {
      this.isShow = !this.isShow
      console.log("prescriptionList", this.prescriptionList)
      console.log("list", this.list)
    }
  },
  created () {
    this.getPrescriptionList()
  }

}
</script>

<style>
.fetch-medicine {
  width: 700px;
  margin: 50px auto;
}
</style>

