<template>
  <div class='order-manage'>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-tickets"></i> 订单列表</el-breadcrumb-item>
        <el-breadcrumb-item><i class="el-icon-tickets"></i> 未发货订单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="warning" icon="delete" class="handle-del mr10" @click="refreshOrderList">刷新</el-button>
        <el-input v-model="searchKeyword" placeholder="根据用户名搜索订单" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
      </div>

      <el-collapse accordion class='collapse-main'>
        <el-collapse-item class='collapse-item'>
          <template slot="title">
            <div class='collapse-content'>
              <span class='order-id'>订单ID</span>
              <span class='order-number'>订单号</span>
              <span class='order-owner'>客户</span>
              <span class='order-created-at'>提交时间</span>
            </div>
            <i class="header-icon el-icon-info"></i>
          </template>
          <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
          <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
        </el-collapse-item>

        <el-collapse-item>
          <template slot="title">
            一致性 Consistency<i class="header-icon el-icon-info"></i>
          </template>
          <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
          <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
        </el-collapse-item>

        <el-collapse-item>
          <template slot="title">
            一致性 Consistency<i class="header-icon el-icon-info"></i>
          </template>
          <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
          <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
        </el-collapse-item>

        <el-collapse-item>
          <template slot="title">
            一致性 Consistency<i class="header-icon el-icon-info"></i>
          </template>
          <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
          <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
        </el-collapse-item>
      </el-collapse>


      <el-table class='order-list' :data="orderTableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="order.orderId" label="订单ID" sortable width="180">
          <template slot-scope="scope">
            <el-collapse accordion>
              <el-collapse-item>
                <template slot="title">
                  一致性 Consistency<i class="header-icon el-icon-info"></i>
                </template>
                <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
                <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
              </el-collapse-item>
            </el-collapse>
          </template>
        </el-table-column>
        <el-table-column prop="order.orderId" label="订单号" sortable width="180"></el-table-column>
        <el-table-column prop="order.createdBy" label="订单号" sortable width="180"></el-table-column>

        <el-table-column label="用户头像" width="100">
          <template slot-scope="scope">
            <img :src="scope.rowl" alt="" style="width: 80px; height: 80px;"/>
          </template>
        </el-table-column>
        <el-table-column prop="wxInfo.nickName" label="用户昵称" width="80">
        </el-table-column>
        <el-table-column prop="openId" label="OpenID">
        </el-table-column>
        <el-table-column label="性别" width="80">
          <template slot-scope="scope">
            {{ scope.row.wxInfo.gender === 1 ? "男" : "女" }}
          </template>
        </el-table-column>
        <el-table-column prop="teamInfo.team.invitationCode" label="邀请码" width="80">
        </el-table-column>
        <el-table-column prop="teamInfo.team.superiorAgent" label="上级代理">
        </el-table-column>
        <el-table-column prop="teamInfo.team.topAgent" label="顶级代理">
        </el-table-column>
        <el-table-column prop="teamInfo.secondAgents.count" label="下级代理（总计）" width="80">
        </el-table-column>
        <el-table-column label="操作" width="148">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination" v-if='!isEmpty'>
        <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :page-size='pageInfo.pageSize' :total="orderGroups.length">
        </el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="用户更新" :visible.sync="editVisible" width="40%">
      <el-form v-if='editVisible' ref="form" :model="form" label-width="80px" :span='24'>
        <label class='wx-info'>微信信息</label>
        <el-form-item label="用户头像">
          <img :src="form.wxInfo.avatarUrl" alt="用户头像" style="width: 80px; height: 80px;"/>
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input type='text' readonly :value='form.wxInfo.nickName' class='compose-input'/>
        </el-form-item>
        <el-form-item label="用户性别">
          <el-input type='text' readonly :value='form.wxInfo.gender' class='compose-input'/>
        </el-form-item>
        <el-form-item label="Open ID">
          <el-input type='text' readonly :value='form.openId' class='compose-input'/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="400px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import bus from '@/components/common/bus.js';
import OrderService from '@/services/order.service.js';
import {UNPAY_ORDER, UNDERWAY_ORDER, REFUND_ORDER, COMPLETED_ORDER, CANCEL_ORDER} from '@/utils/constants.js';

export default {
  name: 'OrderManage',
  components: {},
  data () {
    return {
      url: "./static/vuetable.json",
      orderGroups: [],
      pageInfo: {
        pageSize: 10,
        currentPage: 1,
      },
      multipleSelection: [],
      select_cate: "",
      searchKeyword: "",
      del_list: [],
      is_search: false,
      editVisible: false,
      delVisible: false,
      form: {
        openId: '',
        order: {},
        teamInfo: {},
        wxInfo: {},
      },
      deleteItem: [],
    };
  },
  mounted () {
    this.loadData();
  },

  computed: {
    isEmpty () {
      return _.isEmpty(this.orderGroups);
    },
    orderTableData () {
      let currentPage = (this.pageInfo.currentPage - 1);
      let pageSize = this.pageInfo.pageSize;
      const orderGroups = this.orderGroups.slice(currentPage * pageSize, currentPage * pageSize + pageSize);
      return orderGroups;
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.pageInfo.currentPage = val;
    },
    async loadData() {
      bus.$emit('loading', true);
      console.log(UNDERWAY_ORDER);
      const result = await OrderService.querySpecialOrders({status: UNDERWAY_ORDER}).catch(err => {
        bus.$emit('loading', false);
        this.$message.error("获取用户数据失败", err);
      });
      bus.$emit('loading', false);
      if (result.status === 200) {
        this.orderGroups = this.convertOrderGroups(result.data);
        console.log('===========', this.orderGroups);
      } else {
        this.$message.error("获取用户数据失败", result.message);
      }
    },
    convertOrderGroups (orderGroups) {
      return _.map(orderGroups, order => {
        return order;
      });
    },
    async search() {
      if (_.isEmpty(this.searchKeyword)) {
        return this.$message.warning("请输入搜索条件");
      }
      bus.$emit('loading', true);
      const result = await OrderService.searchOrders({ condition: this.searchKeyword }).catch(err => {
        bus.$emit('loading', false);
        this.$message.error("搜索产品失败: ", err);
      });
      bus.$emit('loading', false);
      if (result.status === 200) {
        this.orderGroups = result.data;
      } else {
        this.$message.error("搜索产品失败", result.message);
      }
    },
    changeStatus (status) {
    },
    refreshOrderList () {
      this.searchKeyword = "";
      this.loadData();
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    handleEdit(index, row) {
      const item = this.orderGroups[index];
      this.form = Object.assign({}, item);
      this.editVisible = true;
    },
    handleDelete(index, row) {
      this.deleteItem = [];

      this.delVisible = true;
      this.deleteItem.push(row.orderId);
    },
    delAll() {
      const length = this.multipleSelection.length;
      let str = "";
      this.del_list = this.del_list.concat(this.multipleSelection);
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].name + " ";
      }
      this.$message.error("删除了" + str);
      this.multipleSelection = [];
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    async saveEdit() {
      const order = Object.assign({}, this.form);
      const result = await OrderService.updateProduct({ order }).catch(err => {
        this.editVisible = false;
        this.$message.error(`产品更新失败: ${err}`);
      });
      this.editVisible = false;
      if (result.status === 200) {
        this.$message.success(`产品更新成功`);
        this.loadData();
      } else {
        this.$message.error(`产品更新失败: ${result.message}`);
      }
    },
    async deleteRow() {
      const result = await OrderService.deleteProduct({ productIds: this.deleteItem }).catch(err => {
        this.delVisible = false;
        this.$message.error(`产品删除失败: ${err}`);
      });
      this.delVisible = false;
      if (result.status === 200) {
        this.$message.success("删除成功");
        this.loadData();
      } else {
        this.$message.error(`产品删除失败: ${result.message}`);
      }
    },
  },
  watch: {
    editVisible: function (val) {
      if (!val) {
        this.form = {};
      }
    },
  },
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

.upload-demo {
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
}
</style>
