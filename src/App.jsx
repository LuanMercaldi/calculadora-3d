import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Slider } from '@/components/ui/slider.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Calculator, Printer, Zap, Clock, DollarSign, TrendingUp } from 'lucide-react'
import './App.css'

function App() {
  // Estados para os inputs
  const [pesoFilamento, setPesoFilamento] = useState(143)
  const [tempoImpressao, setTempoImpressao] = useState(728)
  const [custoKwh, setCustoKwh] = useState(1.0)
  const [precoKgFilamento, setPrecoKgFilamento] = useState(120.0)
  const [valorHoraTrabalho, setValorHoraTrabalho] = useState(15.0)
  const [custoImpressora, setCustoImpressora] = useState(2500.0)
  const [margemLucro, setMargemLucro] = useState([50])
  
  // Estados para os resultados
  const [resultados, setResultados] = useState({})

  // Funções de cálculo (baseadas na calculadora Python)
  const calcularCustoEnergia = (tempoMinutos, potenciaWatts = 57, custoKwh = 1.0) => {
    const tempoHoras = tempoMinutos / 60
    const consumoKwh = (potenciaWatts / 1000) * tempoHoras
    return consumoKwh * custoKwh
  }

  const calcularCustoFilamento = (pesoGramas, precoKg) => {
    const pesoKg = pesoGramas / 1000
    return pesoKg * precoKg
  }

  const calcularCustoMaoObra = (tempoMinutos, valorHora) => {
    const tempoTrabalhoHoras = (tempoMinutos * 0.1) / 60
    return tempoTrabalhoHoras * valorHora
  }

  const calcularCustoDepreciacao = (tempoMinutos, custoImpressora, vidaUtilHoras = 5000) => {
    const tempoHoras = tempoMinutos / 60
    const custoPorHora = custoImpressora / vidaUtilHoras
    return tempoHoras * custoPorHora
  }

  const calcularPrecoVenda = () => {
    const custoEnergia = calcularCustoEnergia(tempoImpressao, 57, custoKwh)
    const custoFilamento = calcularCustoFilamento(pesoFilamento, precoKgFilamento)
    const custoMaoObra = calcularCustoMaoObra(tempoImpressao, valorHoraTrabalho)
    const custoDepreciacao = calcularCustoDepreciacao(tempoImpressao, custoImpressora)
    
    const custoTotal = custoEnergia + custoFilamento + custoMaoObra + custoDepreciacao
    const margemDecimal = margemLucro[0] / 100
    const margemLucroValor = custoTotal * margemDecimal
    const precoVenda = custoTotal + margemLucroValor

    return {
      custoEnergia,
      custoFilamento,
      custoMaoObra,
      custoDepreciacao,
      custoTotal,
      margemLucroValor,
      precoVenda,
      margemLucroPercentual: margemLucro[0]
    }
  }

  // Recalcular sempre que os inputs mudarem
  useEffect(() => {
    setResultados(calcularPrecoVenda())
  }, [pesoFilamento, tempoImpressao, custoKwh, precoKgFilamento, valorHoraTrabalho, custoImpressora, margemLucro])

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  const formatarTempo = (minutos) => {
    const horas = Math.floor(minutos / 60)
    const mins = minutos % 60
    return `${horas}h ${mins}min`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Calculadora de Preços</h1>
          </div>
          <p className="text-xl text-gray-600">Impressão 3D - Bambulab A1 Mini</p>
          <Badge variant="secondary" className="mt-2">
            <Printer className="h-4 w-4 mr-1" />
            Consumo: 57W durante impressão
          </Badge>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Painel de Inputs */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Printer className="h-5 w-5" />
                  Dados da Impressão
                </CardTitle>
                <CardDescription>
                  Insira os dados específicos da sua impressão
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="peso">Filamento Usado (g)</Label>
                    <Input
                      id="peso"
                      type="number"
                      value={pesoFilamento}
                      onChange={(e) => setPesoFilamento(Number(e.target.value))}
                      className="text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tempo">Tempo (minutos)</Label>
                    <Input
                      id="tempo"
                      type="number"
                      value={tempoImpressao}
                      onChange={(e) => setTempoImpressao(Number(e.target.value))}
                      className="text-lg"
                    />
                    <p className="text-sm text-gray-500">{formatarTempo(tempoImpressao)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Custos e Preços
                </CardTitle>
                <CardDescription>
                  Configure os custos base para o cálculo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="kwh">Custo kWh (R$)</Label>
                    <Input
                      id="kwh"
                      type="number"
                      step="0.01"
                      value={custoKwh}
                      onChange={(e) => setCustoKwh(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="filamento">Filamento/kg (R$)</Label>
                    <Input
                      id="filamento"
                      type="number"
                      step="0.01"
                      value={precoKgFilamento}
                      onChange={(e) => setPrecoKgFilamento(Number(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trabalho">Valor/hora trabalho (R$)</Label>
                    <Input
                      id="trabalho"
                      type="number"
                      step="0.01"
                      value={valorHoraTrabalho}
                      onChange={(e) => setValorHoraTrabalho(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="impressora">Custo impressora (R$)</Label>
                    <Input
                      id="impressora"
                      type="number"
                      step="0.01"
                      value={custoImpressora}
                      onChange={(e) => setCustoImpressora(Number(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Margem de Lucro
                </CardTitle>
                <CardDescription>
                  Ajuste a margem de lucro desejada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Margem de Lucro</Label>
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      {margemLucro[0]}%
                    </Badge>
                  </div>
                  <Slider
                    value={margemLucro}
                    onValueChange={setMargemLucro}
                    max={200}
                    min={10}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>10%</span>
                    <span>100%</span>
                    <span>200%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Painel de Resultados */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Breakdown de Custos
                </CardTitle>
                <CardDescription>
                  Detalhamento de todos os custos envolvidos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium">Energia Elétrica</span>
                    </div>
                    <span className="font-bold text-yellow-700">
                      {formatarMoeda(resultados.custoEnergia || 0)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 bg-green-600 rounded-full" />
                      <span className="font-medium">Filamento</span>
                    </div>
                    <span className="font-bold text-green-700">
                      {formatarMoeda(resultados.custoFilamento || 0)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Mão de Obra</span>
                    </div>
                    <span className="font-bold text-blue-700">
                      {formatarMoeda(resultados.custoMaoObra || 0)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Printer className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">Depreciação</span>
                    </div>
                    <span className="font-bold text-purple-700">
                      {formatarMoeda(resultados.custoDepreciacao || 0)}
                    </span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-lg">Custo Total</span>
                  <span className="font-bold text-xl text-gray-800">
                    {formatarMoeda(resultados.custoTotal || 0)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
                  <span className="font-semibold text-lg">Margem de Lucro ({resultados.margemLucroPercentual}%)</span>
                  <span className="font-bold text-xl text-indigo-700">
                    {formatarMoeda(resultados.margemLucroValor || 0)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <TrendingUp className="h-6 w-6" />
                  Preço de Venda Sugerido
                </CardTitle>
                <CardDescription className="text-green-600">
                  Valor final recomendado para seu produto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-5xl font-bold text-green-700 mb-2">
                    {formatarMoeda(resultados.precoVenda || 0)}
                  </div>
                  <p className="text-green-600">
                    Com {resultados.margemLucroPercentual}% de margem de lucro
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Dicas */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800">💡 Dicas de Precificação</CardTitle>
              </CardHeader>
              <CardContent className="text-blue-700 space-y-2">
                <p>• <strong>30-50%:</strong> Margem conservadora para produtos simples</p>
                <p>• <strong>50-80%:</strong> Margem padrão para produtos personalizados</p>
                <p>• <strong>80-150%:</strong> Margem para produtos complexos ou únicos</p>
                <p>• Considere também: embalagem, marketing e tempo de entrega</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

