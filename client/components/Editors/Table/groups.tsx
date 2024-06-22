interface Group {
  name: string
  header: string
}

export function createGroups(letterAmount: number): Array<Group> {
  // Generate an array with letters from the latin alphabet
  const alpha = Array.from(Array(letterAmount)).map((_e, i) => i + 65)
  const alphabet = alpha.map((x) => String.fromCharCode(x))

  const groups: Array<Group> = []

  alphabet.forEach((letter) => {
    const letterEntry = {
      name: letter,
      header: letter,
      headerStyle: { textAlign: 'center' },
    }
    groups.push(letterEntry)
  })

  return groups
}
