export const MARKS = [
  'arc',
  'area',
  'bar',
  'boxplot',
  'circle',
  'errorband',
  'errorbar',
  'geoshape',
  'image',
  'line',
  'point',
  'rect',
  'rule',
  'square',
  'text',
  'tick',
  'trail',
]

export const CHANNEL_TYPES = [
  // Position Channels
  'x',
  'y',
  'x2',
  'y2',
  'xError',
  'yError',
  'xError2',
  'yError2',

  // Position Offset Channels
  'xOffset',
  'yOffset',

  // Polar Position Channels
  'theta',
  'radius',
  'theta2',
  'radius2',

  // Geographic Position Channels
  'longitude',
  'latitude',
  'longitude2',
  'latitude2',

  // Mark Properties Channels
  'color',
  'opacity',
  'fillOpacity',
  'strokeOpacity',
  'strokeWidth',
  'strokeDash',
  'size',
  'angle',
  'shape',

  // Text and Tooltip Channels
  'text',
  'tooltip',

  // Hyperlink Channel
  'href',

  // Description Channel
  'description',

  // Level of Detail Channel
  'detail',

  // Key Channel
  'key',

  // Order Channel
  'order',

  // Facet Channels
  'facet',
  'row',
  'column',
]

export const CHANNEL_AGGREGATES = [
  'argmax',
  'argmin',
  'average',
  'ci0',
  'ci1',
  'count',
  'distinct',
  'max',
  'mean',
  'median',
  'min',
  'missing',
  'product',
  'q1',
  'q3',
  'stderr',
  'stdev',
  'stdevp',
  'sum',
  'valid',
  'values',
  'variance',
  'variancep',
]

export const TRANSFORM_TYPES = ['aggregate', 'calculate']
