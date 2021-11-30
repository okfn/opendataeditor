# TODO

## Demo (16.11)

+ implement Inquiry component draft
+ implement Pipeline component draft
---
+ implement draft pipeline running
+ rebase transform CLI call on using pipeline.json
+ rebase validate CLI call on using inquiry.json
+ rebase extract CLI call on using resource.json
+ make extract/validate/transform react to changes
+ implement Status component draft
+ create v1 issues (electron integration + docs/tests/issues)
+ finish support for fk/check/step descriptors

## Initial (28.11)

+ rebase global app state on zustand
+ finish rebasing on a new store/client/server
+ import editor UI
+ proper JSON/YAML export
+ proper JSON/YAML preview
+ implement import
+ rename dialect/strategy
+ improve detector
+ improve dialect
+ move strategy to settings (switch dialect/schema)?
+ fix second time import doesn't work
- improve schema (including listing UIs)
- rework export/preview/import buttons (use format selection)
- improve query
- improve inquiry
- improve pipeline
- ---
- add scenarios (help) to the home page
- don't change page on file upload
- keep selected tab on a page
- add help text to field editing (on active)
- style scroll for listings
- report should accept descriptor instead of report
- second click on config should return to prev page
- implement CSV/EXCEL export
- make yaml default
- have Columns in library to simplify Grid usage
- renabe xField to xInput (currently messing with schema.field)
- add helper texts to buttons
- rebase search on text field
- decide blue/black for heading selectors/buttons (black makes more sense)
- fix the search/indexes problem in the listings
- implement Excel/TabularView mode (a button near the config button)
- ---
- deploy to secret application.frictionlessdata.io
- prepare for user testing sessions
- prepare package issue for Edgar

## MVP (19.12)

- protect users from losing changes by selecting another tab
- react on changes like - re-run describe / update stats / etc
- extract re-usable Metadata/Descriptor components (actions/columns/etc)
- add an ability to sort items in listings?
- extract tab as a library compoenent
- clean/imporve everything
- add clear input file button
- ability to upload schema/dialect?
