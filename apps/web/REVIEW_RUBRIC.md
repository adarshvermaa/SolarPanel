# Engineering Review Rubric

## Functionality
- [ ] **Requirements**: Does the code meet all acceptance criteria?
- [ ] **Edge Cases**: Are error states and edge cases handled (e.g., network failure, empty data)?
- [ ] **UX**: Is the user experience smooth and intuitive?
*Approval*: All critical flows must work. Minor UI nits can be follow-up.

## Accessibility (A11y)
- [ ] **Semantic HTML**: Are correct tags used (button vs div, headings)?
- [ ] **Keyboard Nav**: Can all interactive elements be used with a keyboard?
- [ ] **Screen Readers**: Are aria-labels and roles present where needed?
*Approval*: Must pass automated a11y checks and basic keyboard navigation.

## Performance
- [ ] **Images**: Are images optimized (next/image) and sized correctly?
- [ ] **Bundle Size**: Are large dependencies justified?
- [ ] **Re-renders**: Are unnecessary re-renders minimized?
*Approval*: No regression in Core Web Vitals.

## Security
- [ ] **Input Validation**: Is all user input validated (Zod/Server-side)?
- [ ] **Secrets**: Are no secrets committed to the repo?
- [ ] **Dependencies**: Are there no new vulnerable dependencies?
*Approval*: Zero security risks allowed.

## Tests
- [ ] **Unit Tests**: Are complex logic and components tested?
- [ ] **Integration**: Are key flows covered?
- [ ] **Snapshots**: Are UI changes verified?
*Approval*: Tests must pass. New features need tests.

## Documentation
- [ ] **Comments**: Is complex code explained?
- [ ] **README**: Are setup instructions updated if needed?
- [ ] **Types**: Are TypeScript types clear and exported?
*Approval*: Code must be understandable.

## Changelog
- [ ] **Entry**: Is there a changelog entry for this change?
*Approval*: Required for user-facing changes.
