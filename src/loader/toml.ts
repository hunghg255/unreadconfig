import type { AST } from 'toml-eslint-parser'
import { getStaticTOMLValue, parseTOML } from 'toml-eslint-parser'

export function tomlLoader<T>(_: string, content: string): T {
  const ast: AST.TOMLProgram = parseTOML(content)
  return getStaticTOMLValue(ast) as T
}
