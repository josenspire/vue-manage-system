<template>
  <div class="product-manage">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-tickets"></i> 产品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <!-- <div class="handle-box">
        <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
        <el-input v-model="searchKeyword" placeholder="产品关键字搜索" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
      </div> -->
      <el-table class='product-list' :data="productTableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="productId" label="产品ID" sortable width="180">
        </el-table-column>
        <el-table-column label="产品图片" width="100">
          <template slot-scope="scope">
            <!-- <img src="../../../static/img/img.jpg" alt="" style="width: 80px; height: 80px;"/> -->
            <img :src="scope.row.productPic" alt="" style="width: 80px; height: 80px;"/>
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="产品标题">
        </el-table-column>
        <el-table-column prop="stocks[0].size" label="产品规格" width="80">
        </el-table-column>
        <el-table-column prop="productDesc" label="产品描述">
        </el-table-column>
        <el-table-column prop="stocks[0].originPrice" label="产品单价" width="80">
        </el-table-column>
        <el-table-column prop="stocks[0].quantity" label="产品库存" width="80">
        </el-table-column>
        <!-- <el-table-column prop="name" label="产品库存" :formatter="formatter">
        </el-table-column> -->
        <el-table-column label="操作" width="148">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination" v-if='!isEmpty'>
        <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :page-size='pageInfo.pageSize' :total="productGroups.length">
        </el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="产品编辑" :visible.sync="editVisible" width="40%">
      <el-upload class="upload-demo" ref="upload" action="./v1/api/product/pics/upload"
        :show-file-list="false" name="picUpload"
        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>

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
import ProductService from '@/services/product.service.js';

export default {
  name: "basetable",
  data() {
    return {
      url: "./static/vuetable.json",
      productGroups: [],
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
      return _.isEmpty(this.productGroups);
    },
    productTableData () {
      let currentPage = (this.pageInfo.currentPage - 1);
      let pageSize = this.pageInfo.pageSize;
      const productGroups = this.productGroups.slice(currentPage * pageSize, currentPage * pageSize + pageSize);
      return productGroups;
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.pageInfo.currentPage = val;
    },
    // 获取 easy-mock 的模拟数据
    async getData() {
      const result = await ProductService.queryProduct().catch(err => {
        this.$message.error("获取产品数据失败", err);
      });
      if (result.status === 200) {
        this.productGroups = result.data;
      } else {
        this.$message.error("获取产品数据失败", result.message);
      }
    },
    search() {
      this.is_search = true;
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    handleEdit(index, row) {
      const item = this.productGroups[index];
      this.form = Object.assign({}, item);
      this.editVisible = true;
    },
    handleDelete(index, row) {
      this.deleteItem = [];

      this.delVisible = true;
      this.deleteItem.push(row.productId);
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
      const product = Object.assign({}, this.form);
      const result = await ProductService.updateProduct({ product }).catch(err => {
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
      const result = await ProductService.deleteProduct({ productIds: this.deleteItem }).catch(err => {
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

.avatar-uploader .el-upload {
  width: 180px;
  height: 180px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
}
</style>
