Patches file has latest updates on the top.

Update 11/25/26 ~ 17:45
fix(frontend): correct resize previews and expand interaction tests

- Send resized object dimensions in presence previews instead of the saved object's unchanged position
- Add tests for arrow and triangle hit testing, text wrapping, and marquee selection
- Cover rotation, resize, move, and pan interactions from start through completion
- Test local undo/redo and protection against undoing a peer's newer edit
- Remove canvas text from the shared rotatable-object type

Update 11/25/26 ~16:44 PM
fix(frontend): align rotation types and add shape selection tests

- Show rotation handles only for rotatable shapes
- Add Vitest and configure the shared-code import alias for frontend tests
- Test selection rendering, rotation handles, rectangle and stroke hit testing, rectangle creation, and topmost object selection

Update 11/24/26 ~ 14:30 PM
refactor(frontend): strengthen shape handler types

- Require create and render methods on registered handlers (means no longer optional)
- Replace handler lookup any types with shape-aware types
- Handle optional selection and duplication methods explicitly


Update 11/24/26 ~ 12:40 PM (I wrote aprox time here)
refactor: centralize shape handling and improve local setup

- Use one frontend registry for shape creation and behavior
- Centralize server shape validation dispatch
- Add the frontend to Docker Compose and set the correct database URL
- Document local and Docker workflows and update the project overview
