// Valores de partida: revise conforme fatura de energia, notas de compra e taxas reais.
export const DEFAULT_SETTINGS = Object.freeze({
  printerPrice: 8000,
  usefulLifeYears: 3,
  annualUsagePercent: 30,
  annualMaintenance: 500,
  powerWatts: 190,
  machineReserveFactor: 1.3,
  energyPriceKwh: 0.95,
  laborPriceHour: 30,
  setupMinutesPerPlate: 10,
  finishingMinutesPerPiece: 4,
  packagingPricePerPiece: 1.5,
  materialWastePercent: 10,
  failurePercent: 5,
  taxesPercent: 0,
  targetMarginPercent: 30,
})
export const DEFAULT_JOB = Object.freeze({
  quantity: 1,
  partsPerPlate: 1,
  gramsPerPiece: 30,
  extraWasteGramsPerPlate: 0,
  hoursPerPlate: 2,
  minutesPerPlate: 0,
  extraCostPerOrder: 0,
})
export const DEFAULT_FILAMENTS = [
  { id: 'pla', name: 'PLA comum', priceKg: 80 },
  { id: 'petg', name: 'PETG', priceKg: 95 },
  { id: 'silk', name: 'PLA Silk / especial', priceKg: 110 },
]
export const DEFAULT_CHANNEL_FEES = {
  direto: { percent: 0, perPiece: 0 },
  mercadolivre: { percent: 0, perPiece: 0 },
  nuvemshop: { percent: 0, perPiece: 0 },
}
export const CHANNELS = [
  { id: 'direto', label: 'Venda direta' },
  { id: 'mercadolivre', label: 'Mercado Livre' },
  { id: 'nuvemshop', label: 'Nuvemshop' },
]

const nonnegative = (value) => Math.max(0, Number(value) || 0)
const percentage = (value) => Math.min(100, nonnegative(value)) / 100

/** Margem líquida é calculada SOBRE o preço vendido, após taxas do canal.
 * Não confundir com markup (acréscimo sobre custo). */
export function calculateQuote(job = DEFAULT_JOB, settings = DEFAULT_SETTINGS, priceKg = 80, fees = { percent: 0, perPiece: 0 }) {
  const quantity = Math.max(1, Math.floor(nonnegative(job.quantity)))
  const partsPerPlate = Math.max(1, Math.floor(nonnegative(job.partsPerPlate)))
  const plates = Math.ceil(quantity / partsPerPlate)
  const hoursPerPlate = nonnegative(job.hoursPerPlate) + nonnegative(job.minutesPerPlate) / 60
  const printHours = plates * hoursPerPlate
  const usedGrams = nonnegative(job.gramsPerPiece) * quantity + nonnegative(job.extraWasteGramsPerPlate) * plates
  const material = usedGrams / 1000 * nonnegative(priceKg) * (1 + percentage(settings.materialWastePercent))
  const energy = printHours * (nonnegative(settings.powerWatts) / 1000) * nonnegative(settings.energyPriceKwh)
  const annualHours = 8760 * Math.min(1, percentage(settings.annualUsagePercent))
  const machineHourly = annualHours > 0 && nonnegative(settings.usefulLifeYears) > 0
    ? nonnegative(settings.printerPrice) / (annualHours * nonnegative(settings.usefulLifeYears))
    : 0
  const maintenanceHourly = annualHours > 0
    ? nonnegative(settings.annualMaintenance) / annualHours
    : 0
  const depreciation = printHours * machineHourly
  const maintenance = printHours * maintenanceHourly
  const machineReserve = (energy + depreciation + maintenance) * Math.max(0, nonnegative(settings.machineReserveFactor) - 1)
  const laborMinutes = plates * nonnegative(settings.setupMinutesPerPlate) + quantity * nonnegative(settings.finishingMinutesPerPiece)
  const labor = laborMinutes / 60 * nonnegative(settings.laborPriceHour)
  const packaging = quantity * nonnegative(settings.packagingPricePerPiece)
  const extras = nonnegative(job.extraCostPerOrder)
  const productionBase = material + energy + depreciation + maintenance + machineReserve + labor + packaging + extras
  const failureRate = Math.min(0.99, percentage(settings.failurePercent))
  const failureReserve = productionBase * failureRate / (1 - failureRate)
  const productionCost = productionBase + failureReserve
  const platformPercent = percentage(fees.percent)
  const taxesPercent = percentage(settings.taxesPercent)
  const targetMargin = percentage(settings.targetMarginPercent)
  const fixedFee = quantity * nonnegative(fees.perPiece)
  const denominator = 1 - platformPercent - taxesPercent - targetMargin
  const valid = denominator > 0 && annualHours > 0 && nonnegative(settings.usefulLifeYears) > 0
  const suggestedTotal = valid ? (productionCost + fixedFee) / denominator : null
  const suggestedPerPiece = valid ? suggestedTotal / quantity : null
  const platformFees = valid ? suggestedTotal * platformPercent + fixedFee : null
  const taxes = valid ? suggestedTotal * taxesPercent : null
  const profit = valid ? suggestedTotal - platformFees - taxes - productionCost : null
  return {
    valid, quantity, plates, printHours, usedGrams,
    material, energy, depreciation, maintenance, machineReserve, labor, packaging, extras,
    productionBase, failureReserve, productionCost, fixedFee,
    suggestedTotal, suggestedPerPiece, platformFees, taxes, profit,
    profitPerPiece: valid ? profit / quantity : null,
    achievedMarginPercent: valid && suggestedTotal > 0 ? profit / suggestedTotal * 100 : 0,
    machineCostPerHour: machineHourly + maintenanceHourly +
      (machineHourly + maintenanceHourly + nonnegative(settings.powerWatts) / 1000 * nonnegative(settings.energyPriceKwh)) *
        Math.max(0, nonnegative(settings.machineReserveFactor) - 1) +
        nonnegative(settings.powerWatts) / 1000 * nonnegative(settings.energyPriceKwh),
  }
}