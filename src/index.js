/**
 * A partial player database object
 * @typedef {Object} PlayerPartial
 * @property {string} id The user id (snowflake) of the player
 * @property {number} elo The Elo rating of the player
 */

/**
 * An array of players
 * @typedef {PlayerPartial[]} Team
 */

/**
 * The K factor to use in the Elo calculation
 * @type {number}
 */
const K = 36

/**
 * The winning inflation factor to use in the Elo calculation
 * @type {number}
 */
const WINNING_INFLATION = 1.3

/**
 * The losing inflation factor to use in the Elo calculation
 * @type {number}
 */
const LOSING_INFLATION = 0.85

/**
 * The minimum increase in Elo for a win
 * @type {number}
 */
const MINIMUM_INCREASE = 5

/**
 * The minimum decrease in Elo for a loss
 * @type {number}
 */
const MINIMUM_DECREASE = 10

/**
 * A method to calculate the new Elo ratings given a match result.
 * Players with a higher Elo rating are expected to win more often.
 * Players with a lower Elo rating are expected to win less often.
* @param {Team} winningTeam The team that won the match
* @param {Team} losingTeam The team that lost the match
 */
module.exports.calculate = (winningTeam, losingTeam) => {
  if (!Array.isArray(winningTeam)) throw new TypeError('winningTeam must be an array')
  if (!Array.isArray(losingTeam)) throw new TypeError('losingTeam must be an array')
  if (winningTeam.length < 1) throw new RangeError('winningTeam must have at least one player')
  if (losingTeam.length < 1) throw new RangeError('losingTeam must have at least one player')

  /**
   * @type {PlayerPartial[]}
   */
  const players = winningTeam.concat(losingTeam)

  const totalElo = players.reduce((a, b) => a + b.elo, 0)

  const winningElo = winningTeam.reduce((a, b) => a + b.elo, 0)
  const losingElo = losingTeam.reduce((a, b) => a + b.elo, 0)

  const winningExpected = winningElo / totalElo
  const losingExpected = losingElo / totalElo

  const winningScore = 1
  const losingScore = 0

  const winningMultiplier = K * (winningScore - winningExpected) * WINNING_INFLATION
  const losingMultiplier = K * (losingScore - losingExpected) * LOSING_INFLATION

  const winningTeamAverage = winningTeam.reduce((a, b) => a + b.elo, 0) / winningTeam.length
  const losingTeamAverage = losingTeam.reduce((a, b) => a + b.elo, 0) / losingTeam.length

  // Calculate new score based on winningMultiplier and losingTeamMultiplier
  const adjust = (player, won) => {
    const multiplier = won ? winningMultiplier : losingMultiplier
    const teamAverage = won ? winningTeamAverage : losingTeamAverage
    let score
    if (won) {
      score = player.elo + multiplier + (multiplier * (teamAverage - player.elo) / 400)
      // Penalty for high Elo players
      if (player.elo > losingTeamAverage) score -= 5
      // Penalty if the winning team is too strong
      if (winningTeamAverage > losingTeamAverage) score -= 5
      // Underdog bonus
      if (player.elo < losingTeamAverage) score += 5
      // Minimum increase
      if (score - player.elo < MINIMUM_INCREASE) score = player.elo + MINIMUM_INCREASE
    } else {
      score = player.elo + multiplier - (multiplier * (teamAverage - player.elo) / 400)
      // Reduction for low Elo players
      if (player.elo < winningTeamAverage) score += 5
      // Reduction if the winning team is too strong
      if (winningTeamAverage > losingTeamAverage) score += 5
      // Minimum decrease
      if (player.elo - score < MINIMUM_DECREASE) score = player.elo - MINIMUM_DECREASE
    }
    return {
      id: player.id,
      elo: Math.max(0, Math.round(score))
    }
  }

  return {
    winningTeam: winningTeam.map((player) => adjust(player, true)),
    losingTeam: losingTeam.map((player) => adjust(player, false)),
  }
}