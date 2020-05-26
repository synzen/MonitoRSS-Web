/**
 * @param {any[]} array
 */
function shuffle (array) {
  const clonedArray = [...array]
  // https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
  for (var i = clonedArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = clonedArray[i]
    clonedArray[i] = clonedArray[j]
    clonedArray[j] = temp
  }
  return clonedArray
}

module.exports = shuffle
