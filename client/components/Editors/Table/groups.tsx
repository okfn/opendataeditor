interface Group {
  name: string
  header: string
}

export function createGroups(columnsAmount: number): Array<Group> {
  // Generate an array with letters from the latin alphabet
  const letterACode = 'A'.charCodeAt(0)
  const totalLettersAlphabet = 26

  const columnLabelsArray = []
  let index1, index2

  for (index1 = 0; index1 < totalLettersAlphabet; index1++) {
    columnLabelsArray.push(String.fromCharCode(letterACode + index1))
  }
  for (index1 = 0; index1 < totalLettersAlphabet; index1++) {
    for (index2 = 0; index2 < totalLettersAlphabet; index2++) {
      if (columnLabelsArray.length === columnsAmount) {
        break
      }
      columnLabelsArray.push(
        String.fromCharCode(letterACode + index1) +
          String.fromCharCode(letterACode + index2)
      )
    }
  }

  const groups: Array<Group> = []

  columnLabelsArray.forEach((letter) => {
    const letterEntry = {
      name: letter,
      header: letter,
      headerStyle: { textAlign: 'center' },
    }
    groups.push(letterEntry)
  })

  return groups
}
