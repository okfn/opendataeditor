import * as React from 'react'
import HelpCard from '../../Library/HelpCard'

export default function Help() {
  return (
    <HelpCard
      title="Inquiry"
      subtitle="overview"
      link="https://framework.frictionlessdata.io/docs/guides/validation-guide#validating-an-inquiry"
    >
      Inquiry is a declarative representation of a validation job. It gives you an ability
      to create, export, ans share arbitrary validation jobs containing settings for
      custom checks and/or error settins.
    </HelpCard>
  )
}
