# Calculadora de Preços - Impressão 3D

Uma calculadora interativa para calcular preços de venda de produtos impressos em 3D, desenvolvida especificamente para a **Bambulab A1 Mini**.

## 🚀 Funcionalidades

- ⚡ Cálculo automático de custos de energia elétrica
- 🧵 Cálculo de custos de filamento
- 👷 Cálculo de mão de obra
- 🖨️ Cálculo de depreciação da impressora
- 📊 Breakdown detalhado de todos os custos
- 💰 Sugestões de preço com diferentes margens de lucro
- 🎛️ Interface interativa com sliders e inputs
- 📱 Design responsivo para desktop e mobile

## 🛠️ Tecnologias

- **React** - Framework frontend
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Lucide React** - Ícones

## 📋 Especificações da Impressora

- **Modelo:** Bambulab A1 Mini
- **Consumo durante impressão:** 57W
- **Consumo em standby:** 6W
- **Volume de impressão:** 180 x 180 x 180 mm³

## 🚀 Como usar

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/calculadora-3d.git

# Entre no diretório
cd calculadora-3d

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### Build para produção

```bash
npm run build
```

## 💡 Como calcular preços

1. **Insira os dados da impressão:**
   - Peso do filamento usado (gramas)
   - Tempo de impressão (minutos)

2. **Configure os custos base:**
   - Custo por kWh da energia elétrica
   - Preço do filamento por kg
   - Valor da hora de trabalho
   - Custo da impressora

3. **Ajuste a margem de lucro:**
   - Use o slider para definir a margem desejada
   - Veja o preço final atualizado em tempo real

## 📊 Breakdown de Custos

A calculadora considera:

- **Energia Elétrica:** Baseada no consumo de 57W durante impressão
- **Filamento:** Calculado pelo peso usado e preço por kg
- **Mão de Obra:** Estimativa de 10% do tempo de impressão
- **Depreciação:** Baseada no custo da impressora e vida útil estimada

## 💰 Sugestões de Margem

- **30-50%:** Produtos simples
- **50-80%:** Produtos personalizados
- **80-150%:** Produtos complexos ou únicos

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:

- Reportar bugs
- Sugerir melhorias
- Enviar pull requests

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

Desenvolvido para otimizar a precificação de produtos impressos em 3D.

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!

