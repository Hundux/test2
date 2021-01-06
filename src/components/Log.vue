<template>
  <div>
    <i-modal
      :value="log"
      @on-cancel="cancle"
      width="80%"
      class="serverDetailModal"
      footer-hide
    >
      log</i-modal>
  </div>
</template>

<script>
export default {
  props: {
    log: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    cancle() {
      this.$emit('cancleLogModal')
    }
  },
}
</script>

<style  scoped>
</style>