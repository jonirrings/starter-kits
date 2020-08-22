const NAMESPACE_SEP = '/';

export default function actionDefine(constants, ns) {
  return constants.reduce((memo, key) => {
    memo[key] = val(key).toLowerCase();
    return memo;
  }, {});

  function val(key) {
    if (ns) {
      return `${ns}${NAMESPACE_SEP}${key}`;
    }
    return key;
  }
}
