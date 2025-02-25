import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'

const app = express()
const FINNHUB_API_KEY = 'cuuboshr01qlidi319tgcuuboshr01qlidi319u0'

app.use(cors())

app.get('/stock/:symbol', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase()

  try {
    const companyResponse = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`)
    const companyData = await companyResponse.json()

    const quoteResponse = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`)
    const quoteData = await quoteResponse.json()

    const currentPrice = quoteData.c
    const previousClose = quoteData.pc

    let appreciation = ((currentPrice - previousClose) / previousClose) * 100;
    appreciation = appreciation.toFixed(2)

    if (appreciation === 'NaN') appreciation = '0.00'
    if (appreciation > 100) appreciation = '100+'

    const stockData ={
      symbol: symbol,
      companyName: companyData.name || "Nome não encontrado",
      currentPrice: currentPrice.toFixed(2),
      appreciation: appreciation,
    }

    res.json(stockData)

  } catch (error) {
    console.error("Erro ao buscar dados:", error)
    res.status(500).json({ error: "Erro ao buscar dados da ação" })
  }
})

app.listen(5555, () => {
  console.log('Server rodando na porta 5555')
})
