# elo
The Elo calculation library for Dismal.

Uses an algorithm inspired by the original Elo algorithm, as well as matchmaking ratings from other online video games.

Although written in JavaScript, the library contains JSDoc typings out of the box.
## Installation
Available on npm at https://www.npmjs.com/package/@dismal/elo
Add `@dismal/elo` using your favourite package manager:
```
npm i @dismal/elo
pnpm i @dismal/elo
yarn add @dismal/elo
```
## Features
Calculates new ratings and rating movements for zero-sum games that include two teams of players. In our case, we are trying to quantify the skillfulness of a player using a rating system in order to assist with fair matchmaking.
### Rationale
Based off the following assumptions:
- Players with a higher Elo rating are expected to win more often
- Players with a lower Elo rating are expected to win less often
We can create an algorithm such that:
- If players with a higher score win against players with lower scores, they should gain points, but it should be less
  - The penalty for the losing team should be less, as it was not likely they were going to win in the first place (i.e. they should lose points, but the amount they lose should be less)
- If players with a lower score win against players with a higher score (they have defied the odds), they should gain extra points
  - The penalty for the losing team should be greater, because they should have won (i.e. due to being more skillful, etc.)
### Assumptions
This library uses the following constants that were fine-tuned for our specific use case. It is possible that, when using this library, you would benefit from changing the following values to match your use case:
- The `K` factor
- The inflation factor for winning
- The inflation factor for losing
- The minimum increase (in rating) for a win
- The minimum decrease (in rating) for a loss
- Penalties for wins—if players win but are expected to win, their rating increases by less
  - Penalty (on the increase in rating) for players with a relatively high rating
  - Penalty (on the increase in rating) if the winning team is too strong (i.e. the winning team was expected to win)
- Reduction (cushioning) for losses—if players lose and are expected to lose, their rating decreases by less
  - Reduction (in the decrease in points) for players with a relatively low rating
  - Reduction (in the decrease in points) for players facing a strong team (i.e. the winning team is relatively stronger)
- The underdog bonus for winning—individual players that won against a team with a higher average rating are awarded extra rating
## Documentation
Currently, only one method exists: `calculate`.
### `calculate`
Calculates the new Elo ratings of two teams, given a match result (`winningTeam`, `losingTeam`).
#### Arguments
- `winningTeam`: the team that won the match
- `losingTeam`: the team that lost the match
Both `winningTeam` and `losingTeam` should be an array of objects, of the following format:
```js
{
  id: String,
  elo: Number
}
```
#### Example
```js
const winningTeam = [
  { id: '123', elo: 215 },
  // ...
]
const losingTeam = [
  { id: '456', elo: 200 },
  // ...
]
const { winningTeam: newWinningTeam, losingTeam: newLosingTeam } = calculate(winningTeam, losingTeam)
```
## Examples
See [`src/examples/example.js`](src/examples/example.js)
## License
This library is licensed under the [GNU General Public License v3.0](LICENSE).
## Contributing
To submit a fix, change, or feature addition, please create a pull request to the `master` branch.

Looking for somewhere to start? Check out the [issues](https://github.com/DismalNetwork/elo/issues) tab for things to fix.
