module.exports = {
  extends: ["react-app", "react-app/jest"],
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
    ecmaVersion: 7,
    sourceType: "module",
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  settings: {
    version: "detect",
    createClass: "createReactClass",
    pragma: "React",
    flowVersion: "0.53",
    "import/resolver": {
      node: {
        moduleDirectory: ["node_modules", "src"],
      },
    },
  },
  env: {
    browser: true,
    mocha: true,
    es6: true,
    node: true,
  },
  rules: {
    // 关闭未使用变量校验
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "off",
    // 禁止var
    "no-var": 2,
    // 禁止with
    "no-with": 2,
    // 禁止new Function
    "no-new-func": 2,
    // 禁止new Object
    "no-new-object": 2,
    // 禁止new基本数据类型的包装类
    "no-new-wrappers": 2,
    // 禁止在内置对象上进行扩展（如猴子补丁）
    "no-extend-native": 2,
    // 禁止直接抛出字面量
    "no-throw-literal": 2,
    // new的时候必须加上括号
    "new-parens": 2,
    // switch必须加上default处理
    "default-case": 2,
    // 每个变量需要分别声明
    "one-var": [
      2,
      {
        var: "never",
        let: "never",
        const: "never",
      },
    ],
    // 能用const就const，保存文件时会自动校验let变量如果没有赋值语句就自动转为const，并且强制解构获取的数据为const类型
    "prefer-const": [1, { destructuring: "all" }],
    // 除了null比较以外一律使用===
    eqeqeq: ["error", "always", { null: "ignore" }],
    "react-hooks/exhaustive-deps": "off",
    "no-extend-native": "off",
    "prettier/prettier": [
      "warn",
      {
        singleQuote: true,
        endOfLine: "auto",
        printWidth: 120,
      },
    ],
    "arrow-body-style": ["warn", "as-needed"],
  },
};
