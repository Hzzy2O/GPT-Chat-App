<script lang="ts" setup>
import CreateForm from '../components/createForm.vue'
</script>

<template>
  <NLayoutFooter shadow="[0px_-5px_5pxblack]" bg2 w-full h-135px pb-50px pt-15px>
    <div animate-bounce-in h-74px w-full flex justify-center>
      <div relative animate-head-shake w="80%">
        <!-- <FunctionArea ref="funcArea" :mode="modeValue" @change-mode="changeMode" @send="send" /> -->
        <div
          bg-white
          transition-all
          w-full
          rd-12px
          top-auto
          bottom-0
          overflow-hidden
          class="textareaBox"
        >
          <CreateForm />
        </div>
      </div>
    </div>
  </NLayoutFooter>
</template>
