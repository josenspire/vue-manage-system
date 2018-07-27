<template>
  <div class="user-manage">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-tickets"></i> 用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="warning" icon="delete" class="handle-del mr10" @click="refreshUserList">刷新信息</el-button>
        <el-input v-model="searchKeyword" placeholder="用户昵称搜索" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
      </div>
      <el-table class='user-list' :data="userTableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="user.userId" label="用户ID" sortable width="180">
        </el-table-column>
        <el-table-column label="用户头像" width="100">
          <template slot-scope="scope">
            <img :src="scope.row.wxInfo.avatarUrl" alt="" style="width: 80px; height: 80px;"/>
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
        <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :page-size='pageInfo.pageSize' :total="userGroups.length">
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

        <!-- <el-row :gutter="24">
          <el-col :span='12'>
            <el-form-item label="产品规格">
              <el-input v-model="form.stocks[0].size" class='compose-input'/>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="单价">
              <el-input v-model="form.stocks[0].originPrice" class='compose-input'/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span='12'>
            <el-form-item label="佣金">
              <el-input v-model="form.stocks[0].commission" class='compose-input'/>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="库存">
              <el-input v-model="form.stocks[0].quantity" class='compose-input'/>
            </el-form-item>
          </el-col>
        </el-row> -->
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
import UserService from '@/services/user.service.js';

export default {
  name: "basetable",
  data() {
    return {
      url: "./static/vuetable.json",
      userGroups: [],
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
        openId: 'o_0uP4rQCdGrft8viYxO5rbkkLWg',
        user: {},
        teamInfo: {},
        wxInfo: {},
      },
      deleteItem: [],
    };
  },
  created() {
    this.loadData();
  },
  computed: {
    isEmpty () {
      return _.isEmpty(this.userGroups);
    },
    userTableData () {
      let currentPage = (this.pageInfo.currentPage - 1);
      let pageSize = this.pageInfo.pageSize;
      const userGroups = this.userGroups.slice(currentPage * pageSize, currentPage * pageSize + pageSize);
      return userGroups;
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.pageInfo.currentPage = val;
    },
    // 获取 easy-mock 的模拟数据
    async loadData() {
      bus.$emit('loading', true);
      const result = await UserService.queryUserList().catch(err => {
        bus.$emit('loading', false);
        this.$message.error("获取用户数据失败", err);
      });
      bus.$emit('loading', false);
      if (result.status === 200) {
        this.userGroups = this.convertUserGroups(result.data);
      } else {
        this.$message.error("获取用户数据失败", result.message);
      }
      // this.userGroups = [
      //   { userId: '12345', avatarUrl: '', openId: 'o 45645', nickName: 'james', gender: 1, invitationCode: 'C45477S', superiorAgent: 'asd', topAgent: 'fdsa', agent: 1245 },
      // ];
    },
    convertUserGroups (userGroups) {
      return _.map(userGroups, user => {
        return user;
      });
    },
    async search() {
      if (_.isEmpty(this.searchKeyword)) {
        return this.$message.warning("请输入搜索条件");
      }
      bus.$emit('loading', true);
      const result = await UserService.searchProduct({ condition: this.searchKeyword }).catch(err => {
        bus.$emit('loading', false);
        this.$message.error("搜索产品失败: ", err);
      });
      bus.$emit('loading', false);
      if (result.status === 200) {
        this.userGroups = result.data;
      } else {
        this.$message.error("搜索产品失败", result.message);
      }
    },
    refreshUserList () {
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
      const item = this.userGroups[index];
      this.form = Object.assign({}, item);
      this.editVisible = true;
    },
    handleDelete(index, row) {
      this.deleteItem = [];

      this.delVisible = true;
      this.deleteItem.push(row.userId);
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
      const user = Object.assign({}, this.form);
      const result = await UserService.updateProduct({ user }).catch(err => {
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
      const result = await UserService.deleteProduct({ productIds: this.deleteItem }).catch(err => {
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
};
</script>

<style scoped>
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
