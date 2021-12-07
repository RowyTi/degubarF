<template>
  <notifications
    group="success"
    :duration="5000"
    animation-name="v-fade-right"
    position="top right"
  >
    <template slot="body" slot-scope="props">
      <div class="custom-template">
        <div class="custom-template-icon">
          <i class="mdi mdi-checkbox-marked-circle-outline"></i>
          <!-- alert-octagon-outline -->
        </div>
        <div class="custom-template-content">
          <div class="custom-template-title">
            {{ props.item.title }}
          </div>
          <div class="custom-template-text" v-html="props.item.text"></div>
        </div>
        <div class="custom-template-close" @click="props.close">
          <i class="mdi mdi-close"></i>
        </div>
      </div>
    </template>
  </notifications>
</template>

<script>
export default {
  name: 'SuccessNotification',
}
</script>

<style lang="scss" scoped>
.custom-template {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  text-align: left;
  font-size: 13px;
  margin: 5px;
  margin-bottom: 0;
  align-items: center;
  justify-content: center;
  &,
  & > div {
    box-sizing: border-box;
  }
  background: #e8f9f0;
  border: 2px solid #d0f2e1;
  .custom-template-icon {
    flex: 0 1 auto;
    color: #15c371;
    font-size: 32px;
    padding: 0 10px;
  }
  .custom-template-close {
    flex: 0 1 auto;
    padding: 0 20px;
    font-size: 16px;
    opacity: 0.2;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
  .custom-template-content {
    padding: 10px;
    flex: 1 0 auto;
    .custom-template-title {
      letter-spacing: 1px;
      text-transform: uppercase;
      font-size: 10px;
      font-weight: 600;
    }
  }
}
.v-fade-right-enter-active,
.v-fade-right-leave-active,
.v-fade-right-move {
  transition: all 0.5s;
}
.v-fade-right-enter,
.v-fade-right-leave-to {
  opacity: 0;
  transform: translateX(-500px) scale(0.2);
}
</style>