<template>
  <div class="hello">
    <img v-if="!showDownload" alt="Vue logo" class="img" src="../assets/logo.png">
    <img v-else alt="Vue logo" class="img" src="../assets/logo.jpeg">
    <!-- <a-upload
      name="file"
      action="/api/upload"
      :headers="headers"
      @change="handleChange"
    >
      <a-button v-if="!showDownload">
        <upload-outlined></upload-outlined>
        上传试卷~
      </a-button>
  </a-upload> -->
  <div v-if="!showDownload">
    <input ref="fileInput" type="file" hidden @change="getFile($event)">
    <a-button @click="submitForm($event)" :loading="iconLoading">
      <upload-outlined></upload-outlined>
      上传试卷~
    </a-button>
    </div>
  <br/>
  <div v-if="showDownload">
    <!-- <span>请下载！</span> -->
    <!-- s -->
    <br/>
    <a-button @click="downloadHandler" :loading="iconLoading">下载 pptx</a-button>
    <br/>
    <a-button type="link" @click="backHandler">再来一发</a-button>
  </div>

  
  </div>
</template>

<script>
import { UploadOutlined } from '@ant-design/icons-vue';
import { defineComponent} from 'vue';
import axios from 'axios';
export default defineComponent({
  components: {
    UploadOutlined,
  },
  data(){
    return {
      showDownload: false,
      file: '',
      iconLoading: false
    }
  },
  methods:{
    getFile(event){
      this.file = event.target.files[0];
      console.log(this.file);
      event.preventDefault();
      let formData = new FormData();
      formData.append('file', this.file);
      this.iconLoading = true;
      axios.post('/api/upload',formData,{
        headers:{
          'Content-Type':'multipart/form-data'
        }
      }).then(res =>{
         this.iconLoading = false;
        if(res.status === 200){
          this.showDownload = true;
        }
      })
    },
    submitForm(){
      this.$refs.fileInput.click();
      
    },
    backHandler(){
      this.showDownload = false;
    },
    downloadHandler(){
      this.iconLoading = true;
      axios.get('/api/download',{
        responseType: 'blob'
      }).then((res)=>{
        const { data, headers } = res
        let blob = new Blob([data],{type: headers['content-type']});
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = 'question.pptx';
        a.click();
        window.URL.revokeObjectURL(url);
        this.iconLoading = false;
      });
    }
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.vbox{
  display: flex;
  flex-direction: column;
}
.img{
  width: 400px;
  border-radius:50px;
  margin: 10px;
  border: 3px solid #2f4d6b;
}
</style>
