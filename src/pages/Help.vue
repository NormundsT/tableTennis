<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
  <q-page class="q-pa-lg">
    <div class="text-h6 text-weight-regular">
      Page contains results for 1nce Riga Table Tennis tournament.<br><br><br>
    </div>
    <div class="text-h6 text-weight-regular">
      If you want to participate in the next events:
    </div>
    <div class="text-h6 text-weight-regular q-pl-lg q-mt-lg">
      • Listen to slack channel <a href="https://join.slack.com/share/zt-u4nu26sk-9fHo6DCaSHd3QtyE6cv42Q">#1nce-riga-table-tennis</a>
    </div>
    <small class="q-pl-xl">
         or
    </small>
    <div class="text-h6 text-weight-regular q-pl-lg">
      • Directly contact: Normunds Tamuzs
    </div>
  </q-page>
  </transition>
</template>

<script>
export default {
  name: 'PageIndex'
}
</script>
