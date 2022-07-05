<template>
  <div class="hello">
    <a-upload
      v-model:file-list="fileList"
      name="file"
      action="/api/upload"
      :headers="headers"
      @change="handleChange"
    >
      <a-button>
        <upload-outlined></upload-outlined>
        Click to Upload
      </a-button>
  </a-upload>
  </div>
</template>

<script>
import { UploadOutlined } from '@ant-design/icons-vue';
import { defineComponent, ref } from 'vue';
export default defineComponent({
  components: {
    UploadOutlined,
  },

  setup() {
    const fileList = ref([{
      uid: '-1',
      name: 'xxx.png',
      status: 'done',
      url: 'http://www.baidu.com/xxx.png',
    }]);

    const handleChange = info => {
      let resFileList = [...info.fileList]; // 1. Limit the number of uploaded files
      //    Only to show two recent uploaded files, and old ones will be replaced by the new

      resFileList = resFileList.slice(-2); // 2. read from response and show file link

      resFileList = resFileList.map(file => {
        if (file.response) {
          // Component will show file.url as link
          file.url = file.response.url;
        }

        return file;
      });
      fileList.value = resFileList;
    };

    return {
      fileList,
      handleChange,
    };
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
</style>
