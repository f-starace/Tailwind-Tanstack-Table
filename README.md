# TTTable

A responsive, easily customizable Table based on Tanstack Table (Ract Table v8), Tailwind CSS and Typescript.

> Note: This repo is a work in progress. An important update to increase customizability and flexibility should come by mid September

## Todo:

- [x] Composable Table sub-components
- [x] Added context to avoid prop-drilling of table sub-components
- [x] Add custom classes and styles to table elements
- [x] Added `striped`, `resizable`, `condensed`, `filterGlobal`, `filterColumns`, `pagination`, `striped`, `footer`, `verticalLines`, `bordered` and `sticky` property to table props
- [x] Added column sorting
- [ ] Memoize Table sub-components to avoid unnecessary re-renders
- [ ] Add base defaultColumn if `inputColumns` schema is not defined
- [ ] Make rows selectable and add onSelect prop and selectActions
- [ ] Export table in csv and excel formats
- [ ] Add unit-tests

## Instruction:

1. Clone the repo
2. Install dependencies through
   - npm
     ```bash
     npm install
     ```
   - yarn
     ```bash
     yarn install
     ```
