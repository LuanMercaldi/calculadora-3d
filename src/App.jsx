import { useEffect, useMemo, useState } from 'react'
import { Calculator, Printer, Settings2, Package, TrendingUp, RefreshCw } from 'lucide-react'
import { calculateQuote, DEFAULT_SETTINGS, DEFAULT_JOB, DEFAULT_FILAMENTS, DEFAULT_CHANNEL_FEES, CHANNELS } from './lib/pricing.js'
import './App.css'

const STORAGE_KEY = 'benchybros-calculadora-v2'
const money = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value) || 0)
const number = value => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(Number(value) || 0)
const fromStorage = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return {
      settings: { ...DEFAULT_SETTINGS, ...(saved.settings || {}) },
      job: { ...DEFAULT_JOB, ...(saved.job || {}) },
      filaments: Array.isArray(saved.filaments) && saved.filaments.length ? saved.filaments : DEFAULT_FILAMENTS,
      filamentId: saved.filamentId || 'pla',
      channelId: saved.channelId || 'direto',
      fees: { ...DEFAULT_CHANNEL_FEES, ...(saved.fees || {}) },
    }
  } catch { return { settings: DEFAULT_SETTINGS, job: DEFAULT_JOB, filaments: DEFAULT_FILAMENTS, filamentId: 'pla', channelId: 'direto', fees: DEFAULT_CHANNEL_FEES } }
}
const fields = {
  settings: [
    ['printerPrice', 'Preço de reposição da impressora (R$)', 100], ['usefulLifeYears', 'Vida útil (anos)', 1],
    ['annualUsagePercent', 'Uso médio anual (%)', 1], ['annualMaintenance', 'Manutenção anual (R$)', 10],
    ['powerWatts', 'Consumo médio em impressão (W)', 10], ['machineReserveFactor', 'Reserva da máquina (multiplicador)', 0.05],
    ['energyPriceKwh', 'Energia (R$/kWh)', 0.01], ['laborPriceHour', 'Sua hora de trabalho (R$)', 1],
    ['setupMinutesPerPlate', 'Preparação por placa (min)', 1], ['finishingMinutesPerPiece', 'Acabamento por peça (min)', 1],
    ['packagingPricePerPiece', 'Embalagem por peça (R$)', 0.1], ['materialWastePercent', 'Desperdício extra (%)', 1],
    ['failurePercent', 'Reserva para falhas (%)', 1], ['taxesPercent', 'Impostos sobre venda (%)', 1],
  ],
  job: [
    ['quantity', 'Quantidade de peças', 1], ['partsPerPlate', 'Peças por placa', 1],
    ['gramsPerPiece', 'Filamento por peça (g)', 1], ['extraWasteGramsPerPlate', 'Purgas/suportes extras por placa (g)', 1],
    ['hoursPerPlate', 'Horas de impressão por placa', 1], ['minutesPerPlate', 'Minutos adicionais por placa', 1],
    ['extraCostPerOrder', 'Outros custos do pedido (R$)', 0.5],
  ]
}
function NumberField({ label, value, onChange, step = 1 }) {
  return <label className="field"><span>{label}</span><input type="number" min="0" step={step} value={value} onChange={e => onChange(e.target.value === '' ? 0 : Number(e.target.value))} /></label>
}
function App() {
  const [initial] = useState(fromStorage)
  const [settings, setSettings] = useState(initial.settings)
  const [job, setJob] = useState(initial.job)
  const [filaments, setFilaments] = useState(initial.filaments)
  const [filamentId, setFilamentId] = useState(initial.filamentId)
  const [channelId, setChannelId] = useState(initial.channelId)
  const [fees, setFees] = useState(initial.fees)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ settings, job, filaments, filamentId, channelId, fees }))
  }, [settings, job, filaments, filamentId, channelId, fees])
  const filament = filaments.find(f => f.id === filamentId) || filaments[0]
  const channelFees = fees[channelId] || { percent: 0, perPiece: 0 }
  const result = useMemo(() => calculateQuote(job, settings, filament?.priceKg || 0, channelFees), [job, settings, filament, channelFees])
  const editSetting = (key, value) => setSettings(s => ({ ...s, [key]: value }))
  const editJob = (key, value) => setJob(s => ({ ...s, [key]: value }))
  const editFilament = (key, value) => setFilaments(items => items.map(f => f.id === filamentId ? { ...f, [key]: value } : f))
  const editFee = (key, value) => setFees(v => ({ ...v, [channelId]: { ...(v[channelId] || {}), [key]: value } }))
  const reset = () => { if (window.confirm('Restaurar todos os valores iniciais? Seus ajustes serão perdidos.')) { setSettings({ ...DEFAULT_SETTINGS }); setJob({ ...DEFAULT_JOB }); setFilaments(DEFAULT_FILAMENTS.map(f => ({ ...f }))); setFilamentId('pla'); setChannelId('direto'); setFees({ ...DEFAULT_CHANNEL_FEES }) } }
  const breakdown = [
    ['Filamento, com desperdício', result.material],
    ['Energia elétrica', result.energy],
    ['Depreciação da Creator 5', result.depreciation],
    ['Manutenção e reserva da máquina', result.maintenance + result.machineReserve],
    ['Mão de obra efetiva', result.labor],
    ['Embalagem', result.packaging],
    ['Outros custos', result.extras],
    ['Reserva de falhas', result.failureReserve],
  ]
  return <main className="page">
    <header className="top">
      <div className="brand"><span className="brand-icon"><Printer size={24} /></span><div><strong>3D BENCHY BROS</strong><small>Calculadora de impressão 3D · 2026</small></div></div>
      <button className="ghost" onClick={reset}><RefreshCw size={16} /> Restaurar</button>
    </header>
    <section className="intro"><div><span className="eyebrow">ORÇAMENTOS DE IMPRESSÃO 3D</span><h1>Quanto cobrar pela sua impressão?</h1><p>Calculadora configurada para a FlashForge Creator 5. Preencha o peso e o tempo informados pelo fatiador, escolha o canal de venda e confira o lucro real.</p></div><span className="printer-tag">FlashForge Creator 5 · bico 0,4 mm</span></section>
    <div className="layout">
      <div className="left-stack">
        <section className="panel"><h2><Calculator size={19} /> Dados da impressão</h2><p className="muted">Quando várias peças são feitas na mesma placa, informe o peso por unidade e o tempo da placa inteira.</p><div className="field-grid">{fields.job.map(([key, label, step]) => <NumberField key={key} label={label} step={step} value={job[key]} onChange={v => editJob(key, v)} />)}</div><div className="note">Total: <b>{result.plates} placa(s)</b> · <b>{number(result.printHours)} h</b> de máquina · <b>{number(result.usedGrams)} g</b> de material antes da reserva de perdas.</div></section>
        <section className="panel"><h2><Package size={19} /> Filamento e canal de venda</h2><div className="field-grid"><label className="field"><span>Tipo de filamento</span><select value={filamentId} onChange={e => setFilamentId(e.target.value)}>{filaments.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select></label><NumberField label="Preço pago pelo filamento (R$/kg)" value={filament?.priceKg || 0} step={0.5} onChange={v => editFilament('priceKg', v)} /><label className="field"><span>Canal de venda</span><select value={channelId} onChange={e => setChannelId(e.target.value)}>{CHANNELS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}</select></label><NumberField label="Comissão e taxas percentuais (%)" step={0.5} value={channelFees.percent} onChange={v => editFee('percent', v)} /><NumberField label="Tarifa fixa por peça vendida (R$)" step={0.5} value={channelFees.perPiece} onChange={v => editFee('perPiece', v)} /><NumberField label="Margem desejada sobre a venda (%)" step={1} value={settings.targetMarginPercent} onChange={v => editSetting('targetMarginPercent', v)} /></div><p className="hint">Taxas de marketplace começam em zero porque variam conforme anúncio, faixa de preço e condições da conta. Consulte o simulador da sua venda antes de fechar o orçamento.</p></section>
        <details className="panel advanced"><summary><Settings2 size={19} /> Custos da máquina e operação <span>Editar valores</span></summary><p className="muted">Todos os valores são editáveis. Custo da impressora usa valor de reposição estimado, não necessariamente o que você pagou.</p><div className="field-grid">{fields.settings.map(([key, label, step]) => <NumberField key={key} label={label} step={step} value={settings[key]} onChange={v => editSetting(key, v)} />)}</div><p className="hint">A alíquota de impostos inicia em 0% até confirmar o regime tributário da operação. Os R$ 0,95/kWh, 190 W e preço de reposição de R$ 8 mil são estimativas, não medições da sua instalação.</p></details>
      </div>
      <aside className="right-stack">
        <section className="result-panel"><div className="result-eyebrow"><TrendingUp size={18} /> PREÇO SUGERIDO</div>{result.valid ? <><div className="price">{money(result.suggestedPerPiece)}<span> / peça</span></div><div className="total">Pedido completo: <b>{money(result.suggestedTotal)}</b></div><div className="stats"><div><span>Custo de produção</span><b>{money(result.productionCost)}</b></div><div><span>Lucro estimado</span><b>{money(result.profit)}</b></div><div><span>Margem sobre vendas</span><b>{number(result.achievedMarginPercent)}%</b></div></div></> : <div className="invalid">Não é possível sugerir um preço: a soma de impostos, taxas e margem precisa ser menor que 100%, e a vida útil e o uso anual precisam ser positivos.</div>}</section>
        <section className="panel"><h2>Composição dos custos</h2><div className="costs">{breakdown.map(([name, value]) => <div key={name}><span>{name}</span><strong>{money(value)}</strong></div>)}</div><div className="sub-total"><span>Custo de produção total</span><strong>{money(result.productionCost)}</strong></div>{result.valid && <><div className="costs extra"><div><span>Taxas do canal de venda</span><strong>{money(result.platformFees)}</strong></div><div><span>Impostos estimados</span><strong>{money(result.taxes)}</strong></div><div><span>Lucro projetado</span><strong>{money(result.profit)}</strong></div></div></>}<div className="note">Máquina + energia + reserva: <b>{money(result.machineCostPerHour)}/h</b>. Tempo de trabalho é cobrado por preparação e acabamento, não por todas as horas de impressão.</div></section>
        <p className="disclaimer">Estimativa para orçamento. Fretes, publicidade, serviços de terceiros, licenças e custos não preenchidos não estão incluídos. Valores salvos somente neste navegador.</p>
      </aside>
    </div>
  </main>
}
export default App
