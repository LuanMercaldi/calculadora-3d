# Calculadora 3D — 3D Benchy Bros

Calculadora de preços para impressão 3D, atualizada para a **FlashForge Creator 5** em novembro de 2026.

## Como usar

1. Insira quantas peças serão produzidas, quantas cabem por placa e quantas horas cada placa demora.
2. Informe a massa de **uma unidade**, conforme o OrcaSlicer, e eventuais gramas adicionais de purga por placa.
3. Selecione PLA, PETG ou PLA Silk e confira o preço realmente pago pelo quilo.
4. Escolha venda direta, Mercado Livre ou Nuvemshop; informe **a comissão efetiva e a tarifa fixa** da operação.
5. Ajuste a margem desejada. O resultado diferencia custo de produção, taxas, impostos e lucro.

Os campos do orçamento e os custos ficam salvos **somente no navegador deste dispositivo**.

## Premissas iniciais (editáveis)

- Impressora: FlashForge Creator 5, valor estimado de reposição R$ 8.000, 3 anos de vida útil
- Utilização média: 30% do ano (2.628 horas/ano)
- Manutenção: R$ 500 por ano; reserva de 30% sobre energia, depreciação e manutenção
- Consumo médio estimado: 190 W; energia: R$ 0,95/kWh
- Mão de obra: R$ 30/h, com 10 minutos por placa e 4 minutos de acabamento por peça
- Embalagem: R$ 1,50 por peça; desperdício: 10%; reserva para falhas: 5%
- Filamentos: PLA R$ 80/kg, PETG R$ 95/kg, Silk R$ 110/kg
- **Impostos e comissões iniciam em 0** até que sejam informadas as alíquotas reais. Não são promessas de isenção.

Nenhum valor acima constitui medição técnica, tarifa oficial ou recomendação tributária individual. Confira sua conta de luz, custo dos rolos, horas de impressão e regime tributário.

## Como funciona a conta

- Placas = arredondar para cima (quantidade / peças por placa)
- Horas de impressão = placas × horas de cada placa
- Filamento = ((gramas por unidade × quantidade) + (purga por placa × placas)) × preço/kg × (1 + desperdício %)
- Energia = horas × watts / 1.000 × R$/kWh
- Depreciação = horas × valor de reposição / (vida útil em anos × horas anuais)
- Manutenção = horas × manutenção anual / horas anuais
- Reserva da máquina = (energia + depreciação + manutenção) × (fator - 1)
- Mão de obra = (minutos de preparação por placa × placas + minutos de acabamento por peça × quantidade) × R$/hora / 60
- Reserva de falha = custo base × probabilidade / (1 - probabilidade)
- Preço do pedido = (custo total + quantidade × tarifa fixa por peça) / (1 - margem desejada - impostos percentuais - comissões percentuais)

A **margem desejada** é o lucro restante dividido pela receita bruta de venda (não um markup aplicado diretamente ao custo). Quando a soma de percentuais atinge 100%, a calculadora bloqueia a sugestão.

A fórmula supõe uma tarifa fixa **por peça** e que todas as unidades do pedido são vendidas. Para custos de envio, publicidade, licença ou taxas não cobertas, use o campo de custos extras do pedido. As taxas específicas do marketplace podem variar conforme tipo de anúncio, preço, categoria, benefícios e condições.

## Executar localmente

```bash
npm install
npm run dev
npm test
npm run build
```

A aplicação usa React 19, Vite 6 e CSS. O repositório publica na GitHub Pages via GitHub Actions.
