---
title: Idea Title
body:
  - type: textarea
    id: problem
    attributes:
      label: Problem Statement
      description: What problem are you trying to solve?
      placeholder: Describe the problem or use case
    validations:
      required: true

  - type: textarea
    id: proposal
    attributes:
      label: Proposed Solution
      description: How do you think SCR Runtime should address this?
      placeholder: Describe your proposed solution
    validations:
      required: true

  - type: dropdown
    id: scope
    attributes:
      label: Scope
      description: Which area does this idea relate to?
      options:
        - Core Runtime
        - Browser Module
        - Desktop Module
        - Terminal Module
        - Filesystem Module
        - CLI
        - MCP Server
        - SDK
        - Documentation
        - Other
    validations:
      required: true
