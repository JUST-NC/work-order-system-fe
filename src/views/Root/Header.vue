<template>
  <header>
    <div class="before-part">
      <el-tooltip :content="foldText" placement="bottom">
        <el-button :icon="btnIcon" @click="$emit('click')" circle></el-button>
      </el-tooltip>
      <vertical-divider :isTransparent="true"></vertical-divider>
      <span class="title">ROOT · 管理后台</span>
    </div>
    <div class="after-part">
      <el-tooltip content="全屏模式" placement="bottom">
        <el-button
          @click="toggleFullScreen"
          icon="el-icon-full-screen"
          type="text"
          circle
          plain
        ></el-button>
      </el-tooltip>
      <vertical-divider :isTransparent="true"></vertical-divider>
      <change-role-bar></change-role-bar>
      <vertical-divider :isTransparent="true"></vertical-divider>
      <el-dropdown trigger="click" @command="menuCommand">
        <el-button icon="el-icon-s-custom" circle></el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-setting">设置</el-dropdown-item>
          <el-dropdown-item command="logout" icon="el-icon-switch-button"
            >退出</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </header>
</template>

<script lang="ts">
import Vue from "vue";

import ChangeRoleBar from "@/components/Etc/ChangeRoleBar.vue";
import VerticalDivider from "@/components/Etc/VerticalDivider.vue";

export default Vue.extend({
  props: { isCollapse: Boolean },
  components: {
    VerticalDivider,
    ChangeRoleBar
  },
  methods: {
    toggleFullScreen() {
      if (document.fullscreen) {
        document.exitFullscreen();
      } else {
        document.documentElement.requestFullscreen();
      }
    },
    menuCommand(command: string) {
      switch (command) {
        case "logout": {
          this.$store.commit("clearUserInfo");
          sessionStorage.clear();
          this.$message({
            type: "success",
            message: "退出登录成功!"
          });
          this.$router.replace({ name: "login" });
          break;
        }
        default: {
          this.$message({
            type: "info",
            message: "未知操作"
          });
          break;
        }
      }
    }
  },
  computed: {
    btnIcon() {
      return this.isCollapse ? "el-icon-s-unfold" : "el-icon-s-fold";
    },
    foldText() {
      return this.isCollapse ? "展开菜单" : "折叠菜单";
    }
  }
});
</script>

<style lang="scss" scoped>
header {
  display: flex;
  justify-content: space-between;

  & > .before-part {
    padding-block-start: 1vh;
    padding-inline-start: 1vw;

    & > .title {
      font-weight: 800;
    }
  }

  & > .after-part {
    padding-block-start: 1vh;
    padding-block-end: 1vh;
    padding-inline-end: 1vw;
  }
}
</style>
