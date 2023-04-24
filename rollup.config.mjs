import path from "path"
import ts from "rollup-plugin-typescript2"
import dts from "rollup-plugin-dts"
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [{
  input: "./src/core/index.ts",
  output: [
    {
      file: path.resolve(__dirname, './dist/index.esm.js'),
      format: "es"
    },
    {
      file: path.resolve(__dirname, './dist/index.cjs.js'),
      format: "cjs"
    },
    {
      input: "./src/core/index.ts",
      file: path.resolve(__dirname, './dist/index.js'),
      format: "umd",
      name: "tracker"
    }
  ],
  plugins: [
    ts()
  ],
}, {
  // 自动生成声明文件
  input: "./src/core/index.ts",
  output: {
    file: path.resolve(__dirname, './dist/index.d.ts'),
    format: "es"
  },
  plugins: [dts()]
}]