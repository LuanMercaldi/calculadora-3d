import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateQuote, DEFAULT_SETTINGS, DEFAULT_JOB } from '../src/lib/pricing.js'

test('separa tempo por placa e material por unidade', () => {
  const quote = calculateQuote({ ...DEFAULT_JOB, quantity: 5, partsPerPlate: 2, gramsPerPiece: 10, hoursPerPlate: 1 }, DEFAULT_SETTINGS, 100)
  assert.equal(quote.plates, 3)
  assert.equal(quote.printHours, 3)
  assert.equal(quote.usedGrams, 50)
  assert.equal(quote.material, 5.5)
})
test('margem é sobre receita líquida após taxas e tributos', () => {
  const settings = { ...DEFAULT_SETTINGS, taxesPercent: 6, targetMarginPercent: 30 }
  const quote = calculateQuote(DEFAULT_JOB, settings, 80, { percent: 16, perPiece: 2 })
  assert.ok(quote.valid)
  assert.ok(Math.abs(quote.achievedMarginPercent - 30) < 0.00001)
  assert.ok(Math.abs(quote.suggestedTotal - (quote.productionCost + 2) / 0.48) < 0.00001)
})
test('não gera preço enganoso quando taxas mais margem ultrapassam 100%', () => {
  const quote = calculateQuote(DEFAULT_JOB, { ...DEFAULT_SETTINGS, taxesPercent: 50, targetMarginPercent: 50 }, 80)
  assert.equal(quote.valid, false)
  assert.equal(quote.suggestedTotal, null)
})
test('vida útil e utilização anual inválidas impedem precificação', () => {
  const quote = calculateQuote(DEFAULT_JOB, { ...DEFAULT_SETTINGS, annualUsagePercent: 0 }, 80)
  assert.equal(quote.valid, false)
})
test('sem falhas, custos de falha não são acrescentados', () => {
  const quote = calculateQuote(DEFAULT_JOB, { ...DEFAULT_SETTINGS, failurePercent: 0 }, 80)
  assert.equal(quote.failureReserve, 0)
  assert.ok(quote.valid)
})