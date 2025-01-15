import React, { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import {currencies} from './currencies'



const App = () => {
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [amount, setAmount] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [conversionHistory, setConversionHistory] = useState([]);
  
  
  useEffect(()=>{
    const saveHistory = JSON.parse(localStorage.getItem("history")) || [];
    setConversionHistory(saveHistory)
  },[])
  
  const savedHistory = (entry)=>{
    const updatedHistory = [entry, ...conversionHistory];
    setConversionHistory(updatedHistory);
    localStorage.setItem("history", JSON.stringify(updatedHistory));
  };
  
  const convertCurrencies = async () => {
    try {
      const {data} = await axios.get(`http://localhost:4000/convert?base_currency=${baseCurrency}&currencies=${selectedCurrency}`)
  let result = Object.values(data.data)[0] * amount;
  let roundofResult = result.toFixed(2);
  const countryCode = currencies.find(currency => currency.code === selectedCurrency);
  
  savedHistory({
    result: roundofResult,
    flag: countryCode.flag,
    symbol: countryCode.symbol,
    code: countryCode.code,
    countryName: countryCode.name,
    data: new Date().toLocaleString(),
  });
 
    } catch (error) {
      alert("Error fetching conversion rates.");
    }
  };

  const deleteHistoryItems = (index)=>{
    const updatedHistory = conversionHistory.filter((_,i)=> i !== index);
    localStorage.setItem("history", JSON.stringify(updatedHistory));
    setConversionHistory(updatedHistory);
  };
  return (
    <>
    <div className='h-screen bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center p-5 md:px-20'>
      <div className='bg-white p-6 rounded-lg shadow-md w-full max-w-[660px] h-full overflow-hidden'>
        <h1 className='text-3xl font-bold  text-gray-800 mb-6 overflow-hidden text-center'>Currency Converter</h1>

        <div className='mb-4 px-1'>
          <label className='block text-gray-700 font-bold'>Base Currency</label>
          <select className='w-full border-green-300 bg-gray-200 font-semibold text-xl rounded-lg p-2 my-1'
          value={baseCurrency} onChange={(e)=>setBaseCurrency(e.target.value)}>
            {
              currencies.map(element=>{
                return(
                  <option key={element.code} value={element.code}>{element.name}</option>
                );
              })
            }
          </select>
        </div>

        <div className='mb-4 px-1'>
          <label className='block text-gray-700 font-bold'>Amount</label>
          <input type='number' className='w-full border-green-300 bg-gray-200 font-semibold text-xl rounded-lg p-2 my-1'
          value={amount} onChange={(e)=>setAmount(e.target.value)}></input>
        </div>

        <div className='flex justify-end'>
          <button className='bg-pink-400 text-white p-3 rounded-lg font-semibold text-xl w-50 transition-all duration-300
          hover:bg-pink-500' onClick={convertCurrencies}>Convert</button>
        </div>

        <div className='mb-4 px-1'>
          <label className='block text-gray-700 font-bold'>Currencies to Convert</label>
          <select className='w-full border-green-300 bg-gray-200 font-semibold text-xl rounded-lg p-2 my-1'
          value={selectedCurrency} onChange={(e)=>setSelectedCurrency(e.target.value)}>
            {
              currencies.map(element=>{
                return(
                  <option key={element.code} value={element.code}>{element.name}</option>
                );
              })
            }
          </select>
        </div>

        <div className='mt-6 px-1 '>
          <h2 className='text-2xl px-1 font-bold text-gray-800 mb-4'>Conversion History</h2>
        </div>

        <div className='px-1 h-[400px]'>
        <ul className="px-1">
  {conversionHistory.length > 0 ? (
    conversionHistory.map((element, index) => (
      <li key={index} className="text-gray-700 mv-4 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <img src={`https://flagcdn.com/w40/${element.flag}.png`} alt="countryflag" className="w-11 h-11" />
          <p className="flex-col gap-1 text-gray-500 font-medium">
            <span className="text-xl font-semibold text-black">{element.symbol}</span>
            {element.result}
          </p>
        </div>
        <span onClick={()=>deleteHistoryItems(index)} className='text-gray-500 font-bold text-xl hover:cursor-pointer'>x</span>
      </li>
    ))
  ) : (
    <p className="text-gray-500 font-semibold">No conversion history available.</p>
  )}
</ul>

        </div>


      </div>
    </div>
    </>
  );
};

export default App