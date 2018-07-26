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
        <el-table-column prop="userId" label="用户ID" sortable width="180">
        </el-table-column>
        <el-table-column label="用户头像" width="100">
          <template slot-scope="scope">
            <img :src="scope.row.avatarUrl" alt="" style="width: 80px; height: 80px;"/>
          </template>
        </el-table-column>
        <el-table-column prop="nickName" label="用户昵称" width="80">
        </el-table-column>
        <el-table-column prop="openId" label="OpenID">
        </el-table-column>
        <el-table-column label="性别" width="80">
          <template slot-scope="scope">
            {{ scope.row.gender === 1 ? "男" : "女" }}
          </template>
        </el-table-column>
        <el-table-column prop="invitationCode" label="邀请码" width="80">
        </el-table-column>
        <el-table-column prop="superiorAgent" label="上级代理">
        </el-table-column>
        <el-table-column prop="topAgent" label="顶级代理">
        </el-table-column>
        <el-table-column prop="agent" label="下级代理（总计）" width="80">
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
    <el-dialog title="产品编辑" :visible.sync="editVisible" width="40%">
      <el-form v-if='editVisible' ref="form" :model="form" label-width="80px" :span='24'>
        <el-form-item label="图片链接">
          <el-input type='text' v-model='form.productPic' class='compose-input'/>
        </el-form-item>
        <el-form-item label="完整标题">
          <el-input type='text' v-model='form.productName' class='compose-input'/>
        </el-form-item>
        <el-form-item label="子标题">
          <el-input type='text' v-model='form.productSubName' class='compose-input'/>
        </el-form-item>
        <el-form-item label="产品描述">
          <el-input v-model="form.productDesc" class='compose-input'/>
        </el-form-item>
        <el-row :gutter="24">
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
        </el-row>
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
        name: "",
        date: "",
        address: ""
      },
      imageUrl: '',
      deleteItem: [],
    };
  },
  created() {
    this.getData();
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
    async getData() {
      // bus.$emit('loading', true);
      // const result = await UserService.queryProduct().catch(err => {
      //   bus.$emit('loading', false);
      //   this.$message.error("获取产品数据失败", err);
      // });
      // bus.$emit('loading', false);
      // if (result.status === 200) {
      //   this.userGroups = result.data;
      // } else {
      //   this.$message.error("获取产品数据失败", result.message);
      // }
      this.userGroups = [
        { userId: '12345', avatarUrl: '', openId: 'o 45645', nickName: 'james', gender: 1, invitationCode: 'C45477S', superiorAgent: 'asd', topAgent: 'fdsa', agent: 1245 },
      ];
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
      this.getData();
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
        this.getData();
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
        this.getData();
      } else {
        this.$message.error(`产品删除失败: ${result.message}`);
      }
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      if (res.status === 200) {
        const url = res.data;
        this.imageRemoveUrl = url;
        this.form.productPic = url;
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = (file.type === 'image/jpeg') || (file.type === 'image/jpg') || (file.type === 'image/png');
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('产品图片只能是 JPG / PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('产品图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
  },
  watch: {
    editVisible: function (val) {
      if (!val) {
        this.form = {};
        this.imageUrl = null;
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
