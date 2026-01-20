import { BadRequestException } from "@nestjs/common"
import { EBahPaygrade } from "../../../interfaces/EBahPaygrade"

export type BahJsonRow = Record<string, unknown> & {
  year: string | number
  mha: string
  name: string
}

export type BahJsonPayload = {
  with: BahJsonRow[]
  without: BahJsonRow[]
}

export const PAYGRADE_MAP: Record<string, EBahPaygrade> = {
  e01: EBahPaygrade.E1,
  e02: EBahPaygrade.E2,
  e03: EBahPaygrade.E3,
  e04: EBahPaygrade.E4,
  e05: EBahPaygrade.E5,
  e06: EBahPaygrade.E6,
  e07: EBahPaygrade.E7,
  e08: EBahPaygrade.E8,
  e09: EBahPaygrade.E9,

  w01: EBahPaygrade.W1,
  w02: EBahPaygrade.W2,
  w03: EBahPaygrade.W3,
  w04: EBahPaygrade.W4,
  w05: EBahPaygrade.W5,

  o01: EBahPaygrade.O1,
  o02: EBahPaygrade.O2,
  o03: EBahPaygrade.O3,
  o04: EBahPaygrade.O4,
  o05: EBahPaygrade.O5,
  o06: EBahPaygrade.O6,
  o07: EBahPaygrade.O7,
  o08: EBahPaygrade.O8,
  o09: EBahPaygrade.O9,
  o10: EBahPaygrade.O10,

  o01e: EBahPaygrade.O1E,
  o02e: EBahPaygrade.O2E,
  o03e: EBahPaygrade.O3E,
}

export function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x)
}

export function toYear(value: unknown): number {
  const n = typeof value === 'string' ? Number(value) : typeof value === 'number' ? value : NaN
  if (!Number.isInteger(n) || n < 2000 || n > 2100) {
    throw new BadRequestException(`Invalid year: ${String(value)}`)
  }
  return n
}

export function toMoneyString(value: unknown, ctx: string): string {
  if (value === null || value === undefined || value === '') {
    throw new BadRequestException(`Missing amount for ${ctx}`)
  }

  const n =
    typeof value === 'string'
      ? Number(String(value).replace(',', '').trim())
      : typeof value === 'number'
        ? value
        : NaN

  if (!Number.isFinite(n) || n < 0) {
    throw new BadRequestException(`Invalid amount "${String(value)}" for ${ctx}`)
  }

  // TypeORM decimal column: зберігаємо як string з 2 знаками
  return n.toFixed(2)
}

export function chunk<T>(arr: T[], size: number): T[][] {
  const res: T[][] = []
  for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size))
  return res
}