<template>
  <div>
    <what-table
      :columns="columns"
      :dataSource="tableData"
      :labelDataSource="labelData"
      :options="options"
      :pagination="pagination"
      :fetch="fetchData"
    ></what-table>
    <manager-dialog
      :data="data"
      :data-index="index"
      :is-visible="managerIsVisible"
      @toggle-is-visible="toggleManager"
      @update-table-data="updateTableData"
    ></manager-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import WhatTable from "@/components/Etc/WhatTable.vue";
import { AchievementFilterForm } from "@/interface/filter-form";
import { Achievement } from "@/interface/list-data";
import { Status } from "@/static-data/work-order";
import { getData, postData } from "@/utils/fetchData";

export default Vue.extend({
  components: {
    WhatTable,
    ManagerDialog: () =>
      import("@/components/OfficeAdmin/AchievementEditorDialog.vue")
  },
  data() {
    return {
      managerIsVisible: false,
      data: {},
      index: -1,
      tableData: [],
      labelData: {
        Status
      },
      columns: [
        {
          prop: "production",
          label: "成果名称"
        },
        {
          prop: "class2",
          width: 100,
          label: "类别"
        },
        {
          prop: "class3",
          label: "级别"
        },
        {
          prop: "publishTime",
          width: 100,
          label: "发表时间"
        },
        {
          prop: "status",
          label: "状态",
          width: 100,
          labelList: "Status",
          show: "reason",
          showCondition: -1
        },
        {
          button: true,
          label: "操作",
          width: 200,
          group: [
            {
              name: "管理",
              type: "warning",
              icon: "el-icon-s-grid",
              plain: true,
              onClick: (data: Achievement, index: number) => {
                // 箭头函数写法的 this 代表 Vue 实例
                this.$data.data = data;
                this.$data.index = index;
                this.$data.managerIsVisible = true;
              }
            },
            {
              name: "删除",
              type: "danger",
              icon: "el-icon-delete",
              disabled: false,
              onClick: (data: Achievement, index: number) => {
                if (data.status < 1) {
                  // 这种写法的 this 代表 group 里的对象
                  this.$confirm("删除后将不能直接恢复, 是否继续?", "注意", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                  }).then(() =>
                    getData("/api/office/achievement/delete", {
                      params: {
                        id: data.id
                      }
                    })
                      .then(() => {
                        this.$data.tableData.splice(index, 1);
                        this.$message({
                          message: "工单删除成功",
                          type: "success"
                        });
                      })
                      .catch((err: string) => {
                        this.$message({
                          message: err || "由于未知因素，用户信息删除失败",
                          type: "warning"
                        });
                      })
                  );
                } else {
                  this.$message({
                    message: "仅在 “审核中” 和 “未通过” 时可以进行编辑",
                    type: "warning"
                  });
                }
              }
            }
          ]
        }
      ],
      options: {
        indexProp: "id",
        mutiSelect: false,
        mutiSelectFixed: false,
        index: true, // 显示序号
        indexFixed: false,
        loading: true, // 表格动画
        initTable: true // 初始化表格
      },
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 20
      }
    };
  },
  methods: {
    fetchData(filterForm: AchievementFilterForm) {
      postData("/api/office/achievement/getAchievements", filterForm || {}, {
        params: {
          page: this.pagination.pageIndex,
          size: this.pagination.pageSize
        }
      })
        .then(({ list, total }: { list: Achievement[]; total: number }) => {
          (this.tableData as Achievement[]) = list;
          this.pagination.total = total;
        })
        .catch((err: string) => {
          this.$message({
            message: err || "由于未知因素，无法获取成果类信息",
            type: "warning"
          });
        })
        .finally(() => (this.options.loading = false));
    },
    toggleManager(isVisible: boolean) {
      this.managerIsVisible =
        typeof isVisible === "undefined" ? !this.managerIsVisible : isVisible;
    },
    updateTableData(index: number, data: Achievement) {
      this.$set(this.tableData, index, data);
    }
  }
});
</script>

<style scoped>
div >>> .el-table__body-wrapper {
  max-height: 62vh !important;
}
</style>
