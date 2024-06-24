interface Group {
  name: string
  header: string
}

export function createGroups(letterAmount: number): Array<Group> {
  // Generate an array with letters from the latin alphabet
  const letterACode = 'A'.charCodeAt(0)
  const letterZCode = 'Z'.charCodeAt(0)
  const alpha = Array.from(Array(letterAmount)).map((_e, i) => i + letterACode)
  const alphabet = alpha.map((x) => {
    if (x <= letterZCode) return String.fromCharCode(x)
    else {
      return (
        String.fromCharCode(letterACode + Math.floor((x - letterACode) / 26)) +
        String.fromCharCode(letterACode + (x % 26))
      )
    }
  })
  console.log('alphabet', alphabet)

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
