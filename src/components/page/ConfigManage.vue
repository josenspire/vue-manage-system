<template>
  <div class='config-manage'>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-tickets"></i> <a href='#'>配置详情</a></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <!-- <div class="handle-box">
        <el-button type="warning" icon="delete" class="handle-del mr10" @click="refreshOrderList">刷新</el-button>
        <el-input v-model="searchKeyword" placeholder="根据用户名搜索订单" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
      </div> -->

      <div class='content-detail'>
        <el-form :span='24' :model="configForm" ref="configForm" label-width="100px" class="form-content">
          <el-row>
            <el-col :span='24'>
              <el-form-item label="上级代理佣金比例" prop="commission">
                <el-input v-model="configForm.superiorCommission" :disabled="!isEditable" placeholder="分佣比例（例：10%）"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span='24'>
              <el-form-item label="顶级代理佣金比例" prop="commission">
                <el-input v-model="configForm.topCommission" :disabled="!isEditable" placeholder="分佣比例（例：10%）"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span='24'>
              <el-form-item style='text-align: right;'>
                <el-button type="warning" v-show='!isEditable' @click="handleEdit()">修改配置</el-button>
                <el-button type="primary" v-show='isEditable' @click="submitForm()">确认修改</el-button>
                <el-button v-show='isEditable' @click="cancelEdit()">取消</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import bus from '@/components/common/bus.js';
import ConfigService from '@/services/config.service.js';

export default {
  name: 'ConfigManage',
  components: {},
  data () {
    return {
      searchKeyword: "",
      viewVisible: false,
      editVisible: false,
      editFormData: [],
      configForm: {
        superiorCommission: '',
        topCommission: '',
      },
      isEditable: false,
    };
  },
  mounted () {
    this.loadData();
  },

  computed: {},
  methods: {
    async loadData() {
      bus.$emit('loading', true);
      const result = await ConfigService.queryConfigs().catch(err => {
        bus.$emit('loading', false);
        this.$message.error("获取配置数据失败", err);
      });
      bus.$emit('loading', false);
      if (result.status === 200) {
        this.configForm = result.data;
      } else {
        this.$message.error("获取配置数据失败", result.message);
      }
    },
    handleEdit(index, row) {
      this.isEditable = true;
    },
    async submitForm () {
      bus.$emit('loading', true);
      const result = await ConfigService.updateConfigs({configs: this.configForm}).catch(err => {
        bus.$emit('loading', false);
        this.$message.error("配置修改失败", err);
      });
      bus.$emit('loading', false);
      if (result.status === 200) {
        this.$message.success("配置修改成功");
        this.isEditable = false;
      } else {
        this.$message.error("配置修改失败", result.message);
      }
    },
    cancelEdit () {
      this.isEditable = false;
    },
  },
  watch: {},
}
</script>

<style lang='scss' scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}

.btn-group {
  text-align: right;
}


</style>
