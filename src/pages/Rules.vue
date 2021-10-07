<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <q-page class="q-pa-lg">
      <div class="text-h4 text-weight-regular">
        Game Rules<br><br>
      </div>
      <div class="text-h6 text-weight-regular q-pl-xl">
        Regular table tennis rules are applied. The tournament is held in a format where every player should play
        against all the other players, therefore the tournament takes 3 months.<br>
        Players should organize the games themselves.<br>
        Players should play until one of the players has won 3 sets (3:2, 3:1, 3:0).
      </div>
      <br>
      <div class="text-h4 text-weight-regular">
        Reporting results<br><br>
      </div>
      <div class="text-h6 text-weight-regular q-pl-xl">
        Results should be sent to slack channel - they will be added in the DB eventualy.
      </div>
      <br>
      <div class="text-h4 text-weight-regular">
        Terms<br><br>
      </div>
      <div class="text-h6 text-weight-regular q-pl-xl">
        Total Points - Total winned game count.<br>
        Total Winned Sets - Total winned set count.<br>
        Mutual Points - Winned games in mutual games.<br>
        Mutual Sets - Winned sets in mutual games.<br>
        <br>
      </div>
      <div class="text-h4 text-weight-regular">
        Position Calculation<br><br>
      </div>
      <div class="text-h6 text-weight-regular q-pl-xl">
        1.) Highest position is decided by player total points<br>
        2.) If two players have the same amount of points, then highest position is decided from the mutual game.<br>
        3.) If three or more players have the same amount of points, then:<br>
        <div class="text-h6 text-weight-regular q-pl-xl">
          3.1.) The one with most mutual winned games is in higher position.<br>
          3.2.) The one with most mutual winned sets is in higher position.<br>
          3.3.) If three players have the same amount of total points, total winned sets, mutual points and mutual sets - then they are splitting the positions (4/5/6)
        </div>
        4.) If players have the same amount of total points, but there are no mutual games - then players are ranked ( 4 - 6 )
      </div>
    </q-page>
  </transition>
</template>

<script>
export default {
  name: 'PageIndex'
}
</script>
