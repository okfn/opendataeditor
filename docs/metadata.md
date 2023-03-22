# Metadata

Within the Frictionless Application project we publish set of metadata components for working with Frictionless Standards.

## NPM

Install the library as you usually do with NPM:

```bash
$ npm install @frictionlessdata/application
```

The package provides a set of components and a render function to render it to the DOM:

```javascript
import {render} from '@frictionlessdata/application/render'
import Report from '@frictionlessdata/application/components/Editors/Report'

const props = {report}
const element = document.getElementById('app')
render(Report, props, element)
```

## CDN

Alternatively, it might be linked directly from the CDN ([available distributions](https://unpkg.com/browse/@frictionlessdata/application/)):

```html
<script src="//unpkg.com/@frictionlessdata/application/dist/metadata/metadata.js"></script>
<div id="schema"></div>
<script>
if (document.readyState === 'loading') window.addEventListener("load", () => {
  const props = {descriptor, onChange: (descriptor) => console.log(descriptor)}
  const element = document.getElementById('metadata')
  frictionlessMetadata.render(frictionlessMetadata.Schema, props, element)
})
</script>
```
