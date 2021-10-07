<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
      </q-toolbar>
      <div class="q-px-lg q-pt-sm q-mb-md">
        <div class="text-h5">1NCE Riga Table Tennis</div>
        <div class="text-subtitle1">{{headerTitle}}</div>
      </div>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="200"
      :breakpoint="600"
    >
      <q-scroll-area style="height: calc(100% - 134px); margin-top: 134px; border-right: 1px solid #ddd">
        <q-list padding>
          <q-expansion-item
            expand-separator
          >
            <template v-slot:header>
              <q-item-section avatar>
                <q-avatar rounded color="primary" size="40px" text-color="white" font-size="15px">
                  2021
                </q-avatar>
              </q-item-section>
            </template>
            <q-list>

              <q-item class="q-my-sm" clickable v-ripple
                      to='/table/2021/Q3'>
                <q-item-section avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label> Q3 <small>Jul, Aug, Sep</small></q-item-label>
                </q-item-section>
              </q-item>

              <q-item class="q-my-sm" clickable v-ripple
                      to='/table/2021/Q4'>
                <q-item-section avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label> Q4 <small>Oct, Nov, Dec</small></q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <q-expansion-item
            expand-separator
          >
            <template v-slot:header>
              <q-item-section avatar>
                <q-avatar rounded color="primary" size="40px" text-color="white" font-size="15px">
                  2022
                </q-avatar>
              </q-item-section>
            </template>
            <q-list>
              <q-item class="q-my-sm" disabled>
                <q-item-section avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label> Q1<small>Jan, Feb, Mar</small></q-item-label>
                </q-item-section>
              </q-item>

              <q-item class="q-my-sm" disabled>
                <q-item-section avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label> Q2<small>Apr, May, Jun</small></q-item-label>
                </q-item-section>
              </q-item>

              <q-item class="q-my-sm" disabled>
                <q-item-section avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label> Q3 <small>Jul, Aug, Sep</small></q-item-label>
                </q-item-section>
              </q-item>

              <q-item class="q-my-sm" disabled>
                <q-item-section avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label> Q4 <small>Oct, Nov, Dec</small></q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <q-separator spaced/>
          <q-item clickable v-ripple
                  to='/rules'>
            <q-item-section avatar>
              <q-icon name="description"/>
            </q-item-section>

            <q-item-section>
              Rules
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple
                  to='/help'>
            <q-item-section avatar>
              <q-icon name="help"/>
            </q-item-section>

            <q-item-section>
              Help
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <q-img class="absolute-top" src="4307567.jpg" style="height: 134px">
      </q-img>
    </q-drawer>

    <q-page-container>
      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <router-view/>
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script>

export default {

  name: 'MainLayout',
  data () {
    return {
      defaultYear: '2021',
      defaultSeason: 'Q3',
      selectedYear: undefined,
      selectedSeason: undefined,
      leftDrawerOpen: false,
      years: ['2021', '2022'],
      seasons: ['Q1', 'Q2', 'Q3', 'Q4']
    }
  },
  watch: {
    '$route' (to) {
      if (this.$route.params.year && this.years.includes(this.$route.params.year)) {
        this.selectedYear = this.$route.params.year
      } else {
        this.selectedYear = this.defaultYear
      }

      if (this.$route.params.season && this.seasons.includes(this.$route.params.season)) {
        this.selectedSeason = this.$route.params.season
      } else {
        this.selectedSeason = this.defaultSeason
      }
    },
    selectedSeason: function (season) {
      // TBD on season change
    },
    selectedYear: function (year) {
      // TBD on Year change
    }
  },
  mounted: function () {
    if (this.$route.params.year && this.$route.params.season) {
      // TBD on URL load
    }
  },
  methods: {
  },
  computed: {
    headerTitle: function () {
      if (!this.$route.path.includes('/table/')) {
        return this.$route.path.replace('/', '').toLocaleUpperCase()
      }
      if (this.selectedYear && this.selectedSeason) {
        return `${this.selectedYear} ${this.selectedSeason}`
      }
      return `${this.defaultYear} ${this.defaultSeason}`
    }
  }
}
</script>

<style lang="scss">

</style>
