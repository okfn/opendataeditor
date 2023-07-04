# Library

Within the Frictionless Application project we publish set of metadata components for working with Frictionless Standards. You can test it here: https://metadata.frictionlessdata.io/

## NPM

Install the library as you usually do with NPM:

```bash
$ npm install fdapp
```

The package provides a set of components and a render function to render it to the DOM:

```javascript
import {render} from 'fdapp/render'
import Report from 'fdapp/components/Editors/Report'

const props = {report}
const element = document.getElementById('app')
render(Report, props, element)
```

## CDN

Alternatively, it might be linked directly from the CDN ([available distributions](https://unpkg.com/browse/fdapp/)):

```html
<script src="//unpkg.com/fdapp/dist/metadata/metadata.js"></script>
<div id="schema"></div>
<script>
if (document.readyState === 'loading') window.addEventListener("load", () => {
  const props = {descriptor, onChange: (descriptor) => console.log(descriptor)}
  const element = document.getElementById('metadata')
  frictionlessMetadata.render(frictionlessMetadata.Schema, props, element)
})
</script>
```
