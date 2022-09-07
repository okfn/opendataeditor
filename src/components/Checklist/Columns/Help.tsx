import * as React from 'react'
import HelpCard from '../../Library/HelpCard'

export default function Help() {
  return (
    <HelpCard
      title="Checklist"
      subtitle="overview"
      link="https://framework.frictionlessdata.io/docs/guides/validation-guide#validating-an-inquiry"
    >
      Checklist is a declarative representation of a validation rules. It gives you an
      ability to create, export, ans share arbitrary validation rules.
    </HelpCard>
  )
}
