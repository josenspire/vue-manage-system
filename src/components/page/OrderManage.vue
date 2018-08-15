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

      <el-table class='order-list' :data="orderTableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
        <el-table-column label="编号" width="50" type="index"></el-table-column>

        <el-table-column prop="orderNumber" label="订单号" sortable width="140"></el-table-column>

        <el-table-column prop="user.nickName" label="用户昵称"></el-table-column>

        <el-table-column prop="createdAt" label="下单时间"></el-table-column>

        <el-table-column label="商品数量">
          <template slot-scope="scope">
            {{ scope.row.outbounds.length }}
          </template>
        </el-table-column>

        <el-table-column prop="amount" label="总计"></el-table-column>

        <el-table-column prop="invoice" label="发票"></el-table-column>

        <el-table-column prop="remark" label="备注"></el-table-column>

        <el-table-column label="订单状态">
          <template slot-scope="scope">
            {{ statusMapping(scope.row.status) }}
          </template>
        </el-table-column>
        
        <el-table-column label="操作" align='center'>
          <template slot-scope="scope">
            <el-button size="small" @click="handleDetailsView(scope.$index, scope.row)" type="danger">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination" v-if='!isEmpty'>
        <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :page-size='pageInfo.pageSize' :total="orderGroups.length">
        </el-pagination>
      </div>
    </div>

     <!-- 订单详情弹出框 -->
    <el-dialog title="订单详情" :visible.sync="editVisible" width="80%">
      <el-form v-if='editVisible' ref="viewForm" :model="form" label-width="80px" :span='24'>
        <el-row :gutter="24">
          <el-col :span='8'>
            <el-form-item label="订单号">
              <span>{{editFormData.orderNumber}}</span>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item label="提交时间">
              <span>{{ editFormData.createdAt }}</span>
            </el-form-item>
          </el-col>

          <el-col :span='8'>
            <el-form-item label="订单状态">
              <span>{{ statusMapping(editFormData.status) }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span='8'>
            <el-form-item label="商品数量">{{editFormData.outbounds.length}}</el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item label="折扣">{{editFormData.discount}}</el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item label="总计">{{editFormData.amount}}</el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="产品列表">
          <el-table :data="editFormData.outbounds" border style="width: 100%" ref="multipleTable">
            <el-table-column label="产品名称" prop="productName"></el-table-column>

            <el-table-column label="图片">
              <template slot-scope="scope">
                <img :src='scope.productPic' alt='产品图片' class='product-pic'/>
              </template>
            </el-table-column>

            <el-table-column label="产品价格" prop="productUnitPrice"></el-table-column>
            <el-table-column label="产品数量">
              <template slot-scope="scope">
                <el-input size='mini' type='text' v-model='scope.row.number' :disabled="viewVisible" />
              </template>
            </el-table-column>
            <!-- <el-table-column label="折扣满减">
              <template slot-scope="scope">
                <el-input size='mini' type='text' v-model='scope.row.discount' @change='((e) => (handleEditDiscount(scope.row)))'/>
              </template>
            </el-table-column> -->
            <el-table-column label="总计" prop='amount'></el-table-column>
          </el-table>
        </el-form-item>
        
        <el-form-item class='btn-group'>
          <el-button v-if='editFormData.status === 2' size="small" @click="handleConfirmDeliver(editFormData.orderId)" type="warm">确认发货</el-button>

          <el-button v-if='editFormData.status === 2' size="small" @click="handleComplete(editFormData.orderId)" type="success">完成交易</el-button>
          <el-button v-if='(editFormData.status != 4) && (editFormData.status != 5)' size="small" @click="handleCancel(editFormData.orderId)" type="danger">取消订单</el-button>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = viewVisible = false">取 消</el-button>
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
import {UNPAY_ORDER, UNDERWAY_ORDER, REFUND_ORDER, COMPLETED_ORDER, CANCEL_ORDER, DELIVER_ORDER} from '@/utils/constants.js';
import {orderTabMapping} from '@/utils/orderStatusMapping';

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
      viewVisible: false,
      editVisible: false,
      delVisible: false,
      form: {
        openId: '',
        order: {},
        teamInfo: {},
        wxInfo: {},
      },
      deleteItem: [],
      editFormData: [],
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
    handleDetailsView (index, row) {
      this.editFormData = _.cloneDeep(row);
      this.viewVisible = true;
      this.editVisible = true;
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
    async handleConfirmDeliver (orderId) {
      bus.$emit('loading', true);
      const result = await OrderService.confirmDeliver({orderId}).catch(err => {
        bus.$emit('loading', false);
        this.$message.error("操作失败: ", err);
      });
      bus.$emit('loading', false);
      if (result.status === 200) {
        this.$message.success("确认发货完成");
      } else {
        this.$message.error("操作失败", result.message);
      }
    },
    async handleComplete (orderId) {
      bus.$emit('loading', true);
      const result = await OrderService.completeOrder({orderId}).catch(err => {
        bus.$emit('loading', false);
        this.$message.error("操作失败: ", err);
      });
      bus.$emit('loading', false);
      if (result.status === 200) {
        this.$message.success("订单已完成");
      } else {
        this.$message.error("操作失败", result.message);
      }
    },
    async handleCancel (orderId) {
      bus.$emit('loading', true);
      const result = await OrderService.cancelOrder({orderId}).catch(err => {
        bus.$emit('loading', false);
        this.$message.error("操作失败: ", err);
      });
      bus.$emit('loading', false);
      if (result.status === 200) {
        this.$message.success("订单已取消");
      } else {
        this.$message.error("操作失败", result.message);
      }
    },
    handleEditDiscount (row) {
      console.log(row);
      let amount = row.amount;
      let discount = row.discount;
      if (discount >= amount) {
        row.discount = "0.00";
      }
      row.amount = this.calculateAmount(row);
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
    statusMapping (status) {
      return orderTabMapping(parseInt(status));
    },
    calculateAmount (row) {
      return Number(parseFloat((row.amount * 100 - row.discount * 100) / 100).toFixed(2));
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

.btn-group {
  text-align: right;
}


</style>
