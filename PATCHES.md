Patches file has latest updates on the top.

Update 11/26/26 
refactor(frontend): separate editor command operations
Status: Committed

- Move text sizing, command application, and inverse-command creation out of createEditor
- Keep history, object versions, broadcasting, and the editor API in createEditor
- Add tests for restoring a deleted object and fitting text before applying and sending it
- Verify with 33 passing frontend tests and a successful build; lint passes with four hook dependency warnings in Whiteboard

Update 11/26/26
refactor(frontend): split whiteboard rendering and input handling
Status: Committed

- Extract scene and selection overlay rendering from Whiteboard while preserving cleanup order
- Extract remote presence command handling and add tests for selection conflicts and preview updates
- Build the input interaction context after the canvas is available, type presence, and remove unused hook input
- Verify with 31 passing frontend tests and a successful build; lint passes with four hook dependency warnings in Whiteboard

Update 11/25/26 ~21:39
feat(frontend): rework canvas text and show live creation bounds

- Give canvas text a fixed height, four corner resize handles, rotation, and transparent rendering inside its selection bounds
- Keep the text editing overlay sized and rotated with the object; require text height in server creation validation
- Set content-based minimum width and height for text and textbox during creation, resizing, text edits, and font changes
- Show normalized selection bounds during creation to the creator and other users, including leftward and upward drags
- Send creation presence from pointer down and update the text rotation and selection tests

Compatibility: Existing saved text objects without `height` need a height assigned before those boards are opened with this update.

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
