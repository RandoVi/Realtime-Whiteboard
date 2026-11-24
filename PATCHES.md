Patches file has latest updates on the top.

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