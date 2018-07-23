<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 表单</el-breadcrumb-item>
        <el-breadcrumb-item>图片上传</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="content-title">产品上传</div>
      <div class="plugins-tips">
        <!-- Element UI自带上传组件。 -->
        <!-- 访问地址：<a href="http://element.eleme.io/#/zh-CN/component/upload" target="_blank">Element UI Upload</a> -->
        商品图片上传, 只支持 JPG, JPEG, PNG 格式的图片，大小不超过 1 M;
      </div>
      <!-- <el-upload class="upload-demo" drag action="/api/posts/">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload> -->
      <el-upload class="upload-demo" ref="upload" action="./v1/api/product/pics/upload"
        :show-file-list="false" name="picUpload"
        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <!-- <el-button style="width: 180px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->

      <!-- <div class="content-title">支持裁剪</div> -->
      <!-- <div class="plugins-tips">
        vue-cropperjs：一个封装了 cropperjs 的 Vue 组件。
        访问地址：<a href="https://github.com/Agontuk/vue-cropperjs" target="_blank">vue-cropperjs</a>
      </div> -->
      <!-- <div class="crop-demo">
        <img :src="cropImg" class="pre-img">
        <div class="crop-demo-btn">选择图片
          <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
        </div>
      </div>
  
      <el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="30%">
        <vue-cropper ref='cropper' :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage" style="width:100%; height:300px;"></vue-cropper>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelCrop">取 消</el-button>
          <el-button type="primary" @click="uploadProductPic()">确 定</el-button>
        </span>
      </el-dialog> -->

      <div class="content-title">产品详情</div>
      <div class='content-detail'>
        <el-form :span='24' :model="product" ref="productForm" label-width="100px" class="form-content">
          <el-form-item label="产品图片地址" prop="productPic">
            <el-input v-model="product.productPic" placeholder="https://www.orline.cn/pic.jpg"></el-input>
          </el-form-item>
          <el-form-item label="产品标题" prop="productName">
            <el-input v-model="product.productName" placeholder="JMsolution 蜂蜜面膜, 真正的泰货"></el-input>
          </el-form-item>
          <el-form-item label="产品短标题" prop="productSubName">
            <el-input v-model="product.productSubName" placeholder="JMsolution 蜂蜜面膜"></el-input>
          </el-form-item>
          
          <el-row :gutter="24">
            <el-col :span='12'>
              <el-form-item label="产品描述" prop="productDesc">
                <el-input v-model="product.productDesc" placeholder="泰国RAY面膜，一款真正的泰货，极其服帖的蚕丝，效果远超一线品牌，银色清洁嫩肤，超强补水；金色抗皱去痘亮肤"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label="单位价格" prop="originPrice">
                <el-input v-model="product.originPrice" placeholder="保留 2 位小数点 (58.00)"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="24">
            <el-col :span='12'>
              <el-form-item label="规格尺寸" prop="size">
                <el-input v-model="product.arguments[0].size"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label="库存数量" prop="quantity">
                <el-input v-model="product.arguments[0].quantity"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

           <el-form-item style='text-align: right;'>
              <el-button type="primary" @click="submitForm()">立即创建</el-button>
              <el-button @click="resetForm()">重置</el-button>
            </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '@/components/common/bus.js';
import VueCropper from "vue-cropperjs";
import { addProduct } from '@/services/product.service';

export default {
  name: "upload",
  data: function() {
    return {
      defaultSrc: "./static/img/img.jpg",
      fileList: [],
      imgSrc: "",
      cropImg: "",
      dialogVisible: false,

      imageUrl: '',
      imageRemoveUrl: '11111111',
      product: {
        productName: "",
        productSubName: "",
        productPic: "",
        productDesc: "",
        originPrice: null,
        arguments: [{
          size: '10片装',
	        quantity: 1000,
	  	    originPrice: null,
	      }],
      },
      tempProduct: {
        productName: "",
        productSubName: "",
        productPic: "",
        productDesc: "",
        originPrice: null,
        arguments: [{
          size: '10片装',
	        quantity: 1000,
	  	    originPrice: null,
	      }],
      },
    };
  },
  components: {
    VueCropper
  },
  methods: {
    setImage(e) {
      const file = e.target.files[0];
      if (!file.type.includes("image/")) {
        return;
      }
      const reader = new FileReader();
      reader.onload = event => {
        this.dialogVisible = true;
        this.imgSrc = event.target.result;
        this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
      };
      reader.readAsDataURL(file);
    },
    cropImage() {
      this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
    },
    cancelCrop() {
      this.dialogVisible = false;
      this.cropImg = this.defaultSrc;
    },
    imageuploaded(res) {
      console.log(res);
    },
    handleError() {
      this.$notify.error({
        title: "上传失败",
        message: "图片上传接口上传失败，可更改为自己的服务器接口"
      });
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      if (res.status === 200) {
        const url = res.data;
        this.imageRemoveUrl = url;
        this.product.productPic = url;
      }
    },
    beforeAvatarUpload(file) {
      console.log(file.type);
      const isJPG = (file.type === 'image/jpeg');
      const isPNG = (file.type === 'image/png');
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        this.$message.error('产品图片只能是 JPG / PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('产品图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    async submitForm() {
      bus.$emit('loading', true);
      this.product.arguments[0].originPrice = this.product.originPrice;
      const result = await addProduct({productType: 'normal', productInfo: [this.product]}).catch(err => {
        bus.$emit('loading', true);
        this.$message.error(`产品添加失败: ${err}`);
      });
      bus.$emit('loading', false);
      if (result.status === 200) {
        this.resetForm();
        this.$notify.success({
          title: "添加成功",
          message: "产品添加成功"
        });
      } else {
        this.$message.error(`产品添加失败: ${result.message}`);
      }
    },
    resetForm() {
      this.product = Object.assign({}, this.tempProduct);
      this.product.productPic = this.imageRemoveUrl;
    },
  },
  created() {
    this.cropImg = this.defaultSrc;
  }
};
</script>

<style scoped>
.content-title {
  font-weight: 400;
  line-height: 50px;
  margin: 10px 0;
  font-size: 22px;
  color: #1f2f3d;
}
.content-detail {
  text-align: center;
}
.form-content {
  border: 1px dashed #EBEBEB;
  padding: 20px 20px 20px 10px;
  max-width: 600px;
}

.pre-img {
  width: 100px;
  height: 100px;
  background: #f8f8f8;
  border: 1px solid #eee;
  border-radius: 5px;
}
.crop-demo {
  display: flex;
  align-items: flex-end;
}
.crop-demo-btn {
  position: relative;
  width: 100px;
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
  margin-left: 30px;
  background-color: #409eff;
  color: #fff;
  font-size: 14px;
  border-radius: 4px;
  box-sizing: border-box;
}
.crop-input {
  position: absolute;
  width: 100px;
  height: 40px;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
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