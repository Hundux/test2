<template>
  <div class="record">
    <div class="record-top">
      <i-row style="width:100%">
        <i-col
          span="12"
          class="record-button-group"
        >
          <i-button
            type="success"
            icon="md-checkmark"
            class="record-button"
          >批量恢复运行</i-button>
          <i-button
            type="error"
            icon="md-remove"
            class="record-button"
          >批量禁用</i-button>
          <i-button
            type="error"
            icon="md-close"
            class="record-button"
          >批量取消</i-button>
        </i-col>
        <i-col
          span="12"
          class="record-search"
        >
          <i-input
            v-model="search"
            placeholder="关键词搜索"
            style="width: 200px"
            @on-clear="getTASKList"
            clearable
          />
          <i-button
            type="info"
            icon="md-search"
            class="search"
            @click="searchTask"
          >搜索</i-button>
        </i-col>
      </i-row>
    </div>
    <div class="record-main">
      <i-page
        :total="total"
        :page-size-opts=[10,20,30,40,50,100]
        size="small"
        show-elevator
        show-sizer
        show-total
        placement="bottom"
        :current="current"
        :page-size="pageSize"
        @on-change="pageChange"
        @on-page-size-change="pageSizeChange"
      />
      <i-table
        class="task-table"
        :columns="columns1"
        :data="RecordData"
        stripe
        border
        @on-filter-change="filter"
      >
      </i-table>
      <i-page
        :total="total"
        :page-size-opts=[10,20,30,40,50,100]
        size="small"
        show-elevator
        show-sizer
        show-total
        placement="top"
        :current="current"
        :page-size="pageSize"
        @on-change="pageChange"
        @on-page-size-change="pageSizeChange"
      />
    </div>

    <!-- loading-->
    <div
      v-if="showLoading"
      class="demo-spin-col"
      span="8"
    >
      <i-spin fix>
        <i-icon
          type="ios-loading"
          size=18
          class="demo-spin-icon-load"
        ></i-icon>
        <div>Loading</div>
      </i-spin>
    </div>
  </div>
</template>

<script>
export default {
  name: "Record",
  data() {
    return {
      columns1: [],
      RecordData: [],
      search: "",
      current: 1,
      total: 0,
      pageSize: null,
      showLoading: false
    }
  },
  computed: {
    pageSizeC() {
      return this.$store.state.pageSize
    }
  },
  methods: {
    // page改变
    pageChange(index) {
      this.current = index
    },
    pageSizeChange(size) {
      this.pageSize = size
      localStorage.setItem("pageSize", size)
      this.$store.commit("changePageSize", size)
    },
  },
  mounted() {
    const self = this
    self.pageSize = self.pageSizeC
  },
}
</script>

<style  scoped>
.record-top {
  margin-top: 10px;
  margin-bottom: 10px;
}
.record-button {
  margin-right: 5px;
}
.search {
  margin-left: 20px;
}
</style>