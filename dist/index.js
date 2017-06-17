'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var markTypeValuesMap = {
  em: ['e'],
  strong: ['s'],
  link: ['l'],
  code: ['c'],
};

var markAttrsKeysMap = {
  href: ['h'], // link
  title: ['t'], // link
};

var markKeysMap = {
  type: ['t', markTypeValuesMap],
  attrs: ['a', markAttrsKeysMap],
};

var contentTypeValuesMap = {
  doc: ['d'],
  paragraph: ['p'],
  blockquote: ['b'],
  horizontal_rule: ['h_r'],
  heading: ['h'],
  code_block: ['c_b'],
  text: ['t'],
  image: ['i'],
  hard_break: ['h_b'],
  ordered_list: ['o_l'],
  bullet_list: ['b_l'],
  list_item: ['l_i'],
  table: ['ta'],
  table_row: ['t_r'],
  table_cell: ['t_c'],
};

var contentAttrsKeysMap = {
  level: ['l'], // heading
  src: ['s'], // image
  alt: ['a'], // image
  title: ['t'], // image
  order: ['o'], // ordered_list
  columns: ['c'], // table, table_row
};

var contentKeysMap = {
  type: ['t', contentTypeValuesMap],
  text: ['te'],
  attrs: ['a', contentAttrsKeysMap],
  level: ['l'],
  marks: ['m', markKeysMap],
};
contentKeysMap.content = ['c', contentKeysMap];

var sliceKeysMap = {
  content: ['c', contentKeysMap],
  openLeft: ['oL'],
  openRight: ['oR'],
};

var stepKeysMap = {
  stepType: ['sT'],
  from: ['f'],
  to: ['t'],
  structure: ['st'],
  insert: ['i'],
  gapFrom: ['gF'],
  gapTo: ['gT'],
  slice: ['s', sliceKeysMap],
  mark: ['m', markKeysMap],
};

var selectionKeysMap = {
  head: ['h'],
  anchor: ['a'],
  node: ['n'],
  after: ['af'],
};

var stateKeysMap = {
  doc: ['d', contentKeysMap],
  selection: ['s', selectionKeysMap],
  storedMarks: ['sM', markKeysMap],
};

function invertKeysMap(keysMap) {
  var recursiveInverseKeys = [];
  var inverseKeysMap = Object.assign.apply(Object, Object.entries(keysMap).map(
    function (ref) {
      var key = ref[0];
      var ref_1 = ref[1];
      var inverseKey = ref_1[0];
      var valueKeysMap = ref_1[1];

      return (( obj = {}, obj[inverseKey] = [
          key,
          valueKeysMap && (
            valueKeysMap === keysMap ?
              recursiveInverseKeys.push(inverseKey)
            :
              invertKeysMap(valueKeysMap)
          ) ], obj ))
      var obj;
    }
  ));
  recursiveInverseKeys.forEach(
    function (inverseKey) {
      inverseKeysMap[inverseKey][1] = inverseKeysMap;
    }
  );
  return inverseKeysMap
}

function mapKeys(keysMap, obj) {
  return (
    typeof obj === 'string' ?
      (keysMap[obj] || [ obj ])[0]
    :
    Array.isArray(obj) ?
      obj.map(mapKeys.bind(0, keysMap))
    :
      Object.assign.apply(Object, [ {} ].concat( Object.entries(obj).map(
        function (ref) {
          var key = ref[0];
          var value = ref[1];

          var ref$1 = keysMap[key] || [];
          var mappedKey = ref$1[0]; if ( mappedKey === void 0 ) mappedKey = key;
          var valueKeysMap = ref$1[1];
          return (( obj = {}, obj[mappedKey] = (
              valueKeysMap && value ?
                mapKeys(valueKeysMap, value)
              :
                value
            ), obj ))
          var obj;
        }
      ) ))
  )
}

function keysMappers(keysMap) {
  return [
    mapKeys.bind(0, keysMap),
    mapKeys.bind(0, invertKeysMap(keysMap)) ]
}

function compressStepsLossy(steps, mergedSteps) {
  if ( mergedSteps === void 0 ) mergedSteps = [];

  for (var i = 1, step = steps[0]; i <= steps.length; i++)
    { step = steps[i] && step.merge(steps[i]) || mergedSteps.push(step) && steps[i]; }
  return mergedSteps
}

var ref = keysMappers(stateKeysMap);
var compressStateJSON = ref[0];
var uncompressStateJSON = ref[1];
var ref$1 = keysMappers(selectionKeysMap);
var compressSelectionJSON = ref$1[0];
var uncompressSelectionJSON = ref$1[1];
var ref$2 = keysMappers(stepKeysMap);
var compressStepJSON = ref$2[0];
var uncompressStepJSON = ref$2[1];

exports.compressStateJSON = compressStateJSON;
exports.uncompressStateJSON = uncompressStateJSON;
exports.compressSelectionJSON = compressSelectionJSON;
exports.uncompressSelectionJSON = uncompressSelectionJSON;
exports.compressStepJSON = compressStepJSON;
exports.uncompressStepJSON = uncompressStepJSON;
exports.compressStepsLossy = compressStepsLossy;
exports.keysMappers = keysMappers;
