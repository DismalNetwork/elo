const { calculate } = require('../')

// The winning team
const winningTeam = [
  { id: 'a', elo: 215 },
  { id: 'b', elo: 25 },
  { id: 'c', elo: 15 },
  { id: 'd', elo: 40 },
]
const losingTeam = [
  { id: 'e', elo: 200 },
  { id: 'f', elo: 165 },
  { id: 'g', elo: 105 },
  { id: 'h', elo: 20 },
]

const { winningTeam: newWinningTeam, losingTeam: newLosingTeam } = calculate(winningTeam, losingTeam)
for (const player of newWinningTeam) {
  const oldPlayer = winningTeam.find(p => p.id === player.id)
  console.log(`${player.id} won ${player.elo - oldPlayer.elo} points (${oldPlayer.elo} → ${player.elo})`)
}
console.log('='.repeat(40))
for (const player of newLosingTeam) {
  const oldPlayer = losingTeam.find(p => p.id === player.id)
  console.log(`${player.id} lost ${oldPlayer.elo - player.elo} points (${oldPlayer.elo} → ${player.elo})`)
}