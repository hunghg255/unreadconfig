import type { AST } from 'yaml-eslint-parser'
import { getStaticYAMLValue, parseYAML } from 'yaml-eslint-parser'

export function yamlLoader<T>(_: string, content: string): T {
  const ast: AST.YAMLProgram = parseYAML(content)
  return getStaticYAMLValue(ast) as T
}
