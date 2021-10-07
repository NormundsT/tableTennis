<template>
  <q-page class="bg-white-3 q-pa-md">
    <div v-if="$q.platform.is.mobile">
      <q-btn-group>
        <q-btn :disabled="scaleLeveL <= 0.1" @click="decreaseScaleLevel()" unelevated label="ZOOM OUT" size="md"
               color="teal"/>
        <q-btn :disabled="scaleLeveL > 1" @click="increaseScaleLevel()" unelevated label="ZOOM IN" color="accent"/>
      </q-btn-group>
    </div>
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <table
        v-if="players.length"
        v-bind:style=tableStyle>
        <thead>
        <tr>
          <th/>
          <th v-for="(player, playerIndex) of players" v-bind:key="playerIndex">
            <small>
              {{ player }}
            </small>
          </th>
          <th style="background: orange;">
            Points
          </th>
          <th style="background: orange;">
            Sets
          </th>
          <th style="background: orange;">
            Place
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(player, playerIndex) of players" v-bind:key="playerIndex">
          <td class="special_td">
            {{ player }}
          </td>
          <td v-for="(oponent, oponentIndex) of players" v-bind:key="oponentIndex"
              :class="{ 'grey-cell' : oponentIndex === playerIndex}"
          >
            <template v-if="oponentIndex !== playerIndex && tableData.length">
              <strong v-if="tableData.length">
                {{ getMatchResult(player, oponent) }}
                <template v-if="getMatchResult(player, oponent) === undefined">
                  &emsp;
                </template>
              </strong>
              <hr class="dashed">
              {{ getMatchPoints(player, oponent) }}
              <template v-if="getMatchPoints(player, oponent) === undefined">
                &emsp;
              </template>
            </template>
          </td>
          <td>
            <template v-if="allPlayerPoints.length">
              {{ allPlayerPoints.find(result => result.player === player)['points'] }}
            </template>
          </td>
          <td>
            <template v-if="allPlayerSets.length">
              {{ allPlayerSets.find(result => result.player === player)['setsWon'] }}
            </template>
          </td>
          <td>
            <strong v-if="tableData.length">
              {{ allPlayerPositions.find(result => result.player === player)['position'] }}
            </strong>
          </td>
        </tr>
        </tbody>
      </table>
    </transition>
  </q-page>
</template>

<script>

export default {
  name: 'Table',
  components: {},
  data () {
    return {
      winingSets: 3,
      resultsUrl: 'https://jlky79d8rl.execute-api.eu-central-1.amazonaws.com/1nce/get_table_tennis_data',
      tableData: [],
      allPlayerPositions: [],
      allPlayerPoints: [],
      allPlayerSets: [],
      randomValues: [],
      scaleLeveL: 1,
      defaultYear: '2021',
      defaultSeason: 'Q3',
      selectedYear: undefined,
      selectedSeason: undefined,
      leftDrawerOpen: false,
      years: ['2021', '2022'],
      seasons: ['Q1', 'Q2', 'Q3', 'Q4'],
      players6: ['Zigis', 'Vilis', 'Olegs', 'Glebs', 'Olivers', 'Ulrichs', 'Skapis', 'Paps', 'Zirdziš'],
      players3: ['player0', 'player01', 'player02', 'player03', 'player04'],
      players: [
        'player0', 'player1', 'player2', 'player3', 'player4',
        'player5', 'player6', 'player7', 'player8', 'player9',
        'playepr10', 'asd']
    }
  },
  watch: {
    '$route' (to) {
      this.processYearFromRoute()
      this.processSeasonFromRoute()
    },
    selectedSeasonYear: function (value) {
      if (value) {
        this.fillTableData()
      }
    },
    tableData: function () {
      this.fillAllPlayerPoints()
      this.fillAllPlayerSets()
      this.fillAllPlayerPositions()
    }
  },
  mounted: function () {
    this.processYearFromRoute()
    this.processSeasonFromRoute()
  },
  methods: {
    getMatchResult: function (player, oponent) {
      const points = this.tableData.find(result => result[player] !== undefined && result[oponent] !== undefined)
      if (points && points[player] && points[player] === this.winingSets) {
        return 1
      } else if (points && points[player] !== undefined) {
        return 0
      }
    },
    getMatchPoints: function (player, oponent) {
      const results = this.tableData.find(result => result[player] !== undefined && result[oponent] !== undefined)
      if (results) {
        return results[player] + ' : ' + results[oponent]
      }
    },
    fillTableData: function () {
      this.tableData = []
      this.players = []
      const thisTemp = this
      const url = this.resultsUrl + '?season=' + this.selectedSeason + '&year=' + this.selectedYear
      this.$axios.get(url)
        .then(function (response) {
          if (response.data === null) {
            alert('No results found')
            return
          }
          thisTemp.players = response.data.players
          thisTemp.tableData = response.data.games
        })
        .catch(function (error) {
          alert('Bad Things happened:' + error)
        })
    },
    fillTableData2: function () {
      this.tableData = []
      for (const player of this.players) {
        for (const oponent of this.players) {
          if (player !== oponent && !this.tableData.find(result => result[player] !== undefined && result[oponent] !== undefined)) {
            const playerPoints = this.getValueTillThree(true)
            let oponentPoints
            if (playerPoints === 3) {
              oponentPoints = this.getValueTillThree(false)
            } else {
              oponentPoints = 3
            }

            const result = {}
            result[player] = playerPoints
            result[oponent] = oponentPoints
            // randomize filled results. Used when tested partialy filled table
            if (this.getValueTillThree(false) !== undefined) {
              this.tableData.push(result)
            }
          }
        }
      }
    },
    getValueTillThree: function (includeThree) {
      const rand = Math.floor(Math.random() * 10)
      if (includeThree && rand === 3) {
        return 3
      } else {
        return rand % 3
      }
    },
    fillAllPlayerSets: function () {
      const allPlayerSets = []
      for (const player of this.players) {
        allPlayerSets.push({
          player: player,
          setsWon: this.getPlayerSets(player)
        })
      }
      this.allPlayerSets = allPlayerSets
    },
    getPlayerSets: function (player) {
      let sets = null
      const results = this.tableData.filter(result => result[player] !== undefined)
      for (const result of results) {
        if (sets === null) {
          sets = 0
        }
        sets += result[player]
      }
      return sets
    },
    fillAllPlayerPoints: function () {
      const allPlayerPoints = []
      for (const player of this.players) {
        allPlayerPoints.push({
          player: player,
          points: this.getPlayerPoints(player)
        })
      }
      this.allPlayerPoints = allPlayerPoints
    },
    getPlayerPoints: function (player) {
      let points = null
      const results = this.tableData.filter(result => result[player] !== undefined)
      for (const result of results) {
        if (points === null) {
          points = 0
        }
        if (result[player] === this.winingSets) {
          points += 1
        }
      }
      return points
    },
    fillAllPlayerPositions: function () {
      const allPlayerPositions = []
      for (const player of this.players) {
        allPlayerPositions.push({
          player: player,
          position: this.getPlayerPosition(player)
        })
      }
      this.allPlayerPositions = allPlayerPositions
    },
    getPlayerPosition: function (player) {
      const playerPoints = this.getPlayerPoints(player)
      const playerSets = this.getPlayerSets(player)
      // Get Position only distinct values
      let pointsArray = this.allPlayerPoints.map(result => result.points).sort(function (a, b) { return a - b }).reverse()
      pointsArray = pointsArray.filter(points => points !== null)
      if (pointsArray.filter(point => playerPoints === point).length === 1) {
        return pointsArray.indexOf(playerPoints) + 1
      }

      // If 2 players or more have the same points, higher position is counted:
      // 1.) Mutual games. Maybe somebody has won the other ones
      // 2.) Winned Sets count.
      // 3.) WTF ???
      if (pointsArray.filter(point => playerPoints === point).length > 1) {
        const bestPosition = pointsArray.indexOf(playerPoints) + 1
        const worstPosition = pointsArray.lastIndexOf(playerPoints) + 1
        const playersWithTheSamePointCount = this.allPlayerPoints.filter(result => (result.points === playerPoints)).map(result => result.player)
        const winnedMutualGames = []
        for (const pl of playersWithTheSamePointCount) {
          const playerMutualResults = []
          let playerMutualSets = 0
          for (const op of playersWithTheSamePointCount) {
            if (pl !== op) {
              const playerAndOpenentMutualResult = this.tableData.find(result => result[pl] !== undefined && result[op] !== undefined)
              if (playerAndOpenentMutualResult) {
                playerMutualResults.push(playerAndOpenentMutualResult)
                playerMutualSets += playerAndOpenentMutualResult[pl]
              } else {
                return bestPosition + ' - ' + worstPosition
              }
            }
          }
          const playerMutualWins = playerMutualResults.filter(result => result[pl] === this.winingSets).length
          winnedMutualGames.push({
            player: pl,
            mutualWins: playerMutualWins,
            bigSets: this.allPlayerSets.find(result => result.player === pl).setsWon,
            mutualSets: playerMutualSets
          })
        }
        const playerMutualGamesWinned = winnedMutualGames.find(result => result.player === player).mutualWins
        const playersWithTheSameMutualGamePointCount = winnedMutualGames.filter(result => result.mutualWins === playerMutualGamesWinned)
        const playerCountWithTheSameMutualGamePointCount = playersWithTheSameMutualGamePointCount.length
        if (playerMutualGamesWinned === (playersWithTheSamePointCount.length - 1)) {
          // If somebody have won all mutual games with oponents with the same point count, then he has 'bestPosition'
          return bestPosition
        } else if (playerMutualGamesWinned === 0) {
          // If somebody have lost all mutual games with oponents with the same point count, then he has 'worstPosition'
          return worstPosition
        }
        const mutualWinnedGamesArray = winnedMutualGames.map(result => result.mutualWins).sort(function (a, b) { return a - b }).reverse()
        const mutualWinnedGamesArrayIndex = mutualWinnedGamesArray.findIndex(res => res === playerMutualGamesWinned)
        if (playerCountWithTheSameMutualGamePointCount === 1) {
          // If player have distinct amount of winned games ( besides all and None ) then his position can be calculated
          return bestPosition + mutualWinnedGamesArrayIndex
        } else if (playerCountWithTheSameMutualGamePointCount === 2) {
          // Two players with the same BIG points and 'Mutual Game' Points.
          const oponent = playersWithTheSameMutualGamePointCount.find(result => result.mutualWins === playerMutualGamesWinned && result.player !== player).player
          const mutualGameWithOponent = this.tableData.find(result => result[player] !== undefined && result[oponent] !== undefined)
          if (mutualGameWithOponent[player] === this.winingSets) {
            return bestPosition + mutualWinnedGamesArrayIndex
          } else if (mutualGameWithOponent[oponent] === this.winingSets) {
            return bestPosition + mutualWinnedGamesArrayIndex + 1
          } else {
            // Something is WRONG - One of the players within mutual game should be a winner :D
            return 'WTF ??'
          }
        } else if (playerCountWithTheSameMutualGamePointCount > 2) {
          const bigSetsArrayWithinPlayersWithTheSameMutualWinnedGames = winnedMutualGames.map(result => result.bigSets).sort(function (a, b) { return a - b }).reverse()
          const playerCountWithSameBigPoints = bigSetsArrayWithinPlayersWithTheSameMutualWinnedGames.filter(bigSets => bigSets === playerSets).length
          const sameBigPointsArrayIndex = bigSetsArrayWithinPlayersWithTheSameMutualWinnedGames.indexOf(playerSets)
          if (playerCountWithSameBigPoints === 1) {
            return bestPosition + mutualWinnedGamesArrayIndex + sameBigPointsArrayIndex
          } else if (playerCountWithSameBigPoints === 2) {
            const oponent2 = winnedMutualGames.find(result => result.bigSets === playerSets && result.player !== player).player
            const mutualGameWithOponent = this.tableData.find(result => result[player] !== undefined && result[oponent2] !== undefined)
            if (mutualGameWithOponent[player] === this.winingSets) {
              return bestPosition + mutualWinnedGamesArrayIndex + sameBigPointsArrayIndex
            } else if (mutualGameWithOponent[oponent2] === this.winingSets) {
              return bestPosition + mutualWinnedGamesArrayIndex + sameBigPointsArrayIndex + 1
            } else {
              // Something is WRONG - One of the players within mutual game should be a winner :D
              return 'WTF ??'
            }
          } else {
            // Players with the the same MutualGames Won and win the Same Big Points
            const playerMutualSets = winnedMutualGames.find(result => result.player === player).mutualSets
            const mutualSetsArrayWithinPlayersWithTheSameMutualWinnedGames = winnedMutualGames.map(result => result.mutualSets).sort(function (a, b) { return a - b }).reverse()
            const playerCountWithSameMutualSets = mutualSetsArrayWithinPlayersWithTheSameMutualWinnedGames.filter(mutualSets => mutualSets === playerMutualSets).length
            const sameMutualSetsIndex = mutualSetsArrayWithinPlayersWithTheSameMutualWinnedGames.indexOf(playerMutualSets)
            if (playerCountWithSameMutualSets === 1) {
              return bestPosition + mutualWinnedGamesArrayIndex + sameBigPointsArrayIndex + sameMutualSetsIndex
            } else if (playerCountWithSameMutualSets === 2) {
              const oponent3 = winnedMutualGames.find(result => result.mutualSets === playerMutualSets && result.player !== player).player
              const mutualGameWithOponent = this.tableData.find(result => result[player] !== undefined && result[oponent3] !== undefined)
              if (mutualGameWithOponent[player] === this.winingSets) {
                return bestPosition + mutualWinnedGamesArrayIndex + sameBigPointsArrayIndex + sameMutualSetsIndex
              } else if (mutualGameWithOponent[oponent3] === this.winingSets) {
                return bestPosition + mutualWinnedGamesArrayIndex + sameBigPointsArrayIndex + sameMutualSetsIndex + 1
              } else {
                // Something is WRONG - One of the players within mutual game should be a winner :D
                return 'WTF ??'
              }
            } else if (playerCountWithSameBigPoints === playerCountWithSameMutualSets) {
              // Split places within these players
              const startPosition = bestPosition + mutualWinnedGamesArrayIndex + sameBigPointsArrayIndex
              let position = ''
              for (let i = 0; i < playerCountWithSameMutualSets; i++) {
                position += '/' + (startPosition + i)
              }
              return position
            }
          }
        }
        alert(player)
        return '\n\n WTF \n ERROR \n \n \n'
      }
    },
    fillRandomValues: function () {
      const thisTemp = this
      this.$axios.get('https://www.random.org/integers/?num=1000&min=0&max=1&col=1&base=10&format=plain&rnd=new')
        .then(function (response) {
          thisTemp.randomValues = response.data.split('\n')
        })
        .catch(function (error) {
          alert('Bad Things happened:' + error)
        })
    },
    increaseScaleLevel: function () {
      this.scaleLeveL = this.scaleLeveL + 0.1
    },
    decreaseScaleLevel: function () {
      this.scaleLeveL = this.scaleLeveL - 0.1
    },
    processYearFromRoute: function () {
      if (this.$route.params.year && this.years.includes(this.$route.params.year)) {
        this.selectedYear = this.$route.params.year
      } else {
        this.selectedYear = this.defaultYear
      }
    },
    processSeasonFromRoute: function () {
      if (this.$route.params.season && this.seasons.includes(this.$route.params.season)) {
        this.selectedSeason = this.$route.params.season
      } else {
        this.selectedSeason = this.defaultSeason
      }
    }
  },
  computed: {
    selectedSeasonYear: function () {
      if (this.selectedYear && this.selectedSeason) {
        return this.selectedSeason + this.selectedYear
      }
      return undefined
    },
    headerTitle: function () {
      if (this.selectedYear && this.selectedSeason) {
        return `${this.selectedYear} ${this.selectedSeason}`
      }
      return `${this.defaultYear} ${this.defaultSeason}`
    },
    tableStyle: function () {
      return '-moz-transform: scale(SCALE_LEVEL);  -webkit-transform: scale(SCALE_LEVEL); -o-transform: scale(SCALE_LEVEL); -ms-transform: scale(SCALE_LEVEL); transform: scale(SCALE_LEVEL); padding-right: 50px; -webkit-transform-origin: 0 0;-moz-transform-origin: 0 0;transform-origin: 0 0;'.replaceAll('SCALE_LEVEL', this.scaleLeveL)
    }
  }
}
</script>

<style>
.grey-cell {
  background-color: grey;
}

td, th {
  width: 4rem;
  height: 2rem;
  border: 1px solid #ccc;
  text-align: center;
  background: lightgray;
}

th {
  padding-top: 6px;
  padding-right: 6px;
  padding-bottom: 6px;
  padding-left: 6px;
  color: white;
  background: #1976D2;
  border-color: white;
}

.special_td {
  padding-right: 6px;
  padding-left: 6px;
  border: 1px solid #ccc;
  text-align: center;
  color: white;
  background: #1976D2;
  border-color: white;
}

</style>
