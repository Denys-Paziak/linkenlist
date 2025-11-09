"use client"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"

interface MortgageCalculatorProps {
  listing: any
}

export function MortgageCalculator({ listing }: MortgageCalculatorProps) {
  const [homePrice, setHomePrice] = useState(450000)
  const [downPayment, setDownPayment] = useState(90000)
  const [interestRate, setInterestRate] = useState(7.5)
  const [loanTerm, setLoanTerm] = useState(30)
  const [propertyTaxes, setPropertyTaxes] = useState(500)
  const [homeInsurance, setHomeInsurance] = useState(150)
  const [hoaDues, setHoaDues] = useState(0)
  const [utilities, setUtilities] = useState(200)
  const [creditScore, setCreditScore] = useState("720+")
  const [loanType, setLoanType] = useState("Conventional")
  const [showAdditionalFields, setShowAdditionalFields] = useState(false)

  // Initialize with listing price if available
  useEffect(() => {
    if (listing?.price) {
      const price = Number.parseFloat(listing.price.replace(/[$,]/g, ""))
      if (!isNaN(price)) {
        setHomePrice(price)
        setDownPayment(price * 0.2) // 20% down payment
      }
    }
  }, [listing])

  // Calculate mortgage payment
  const calculateMortgage = () => {
    const principal = homePrice - downPayment
    const monthlyRate = interestRate / 100 / 12
    const numPayments = loanTerm * 12

    if (monthlyRate === 0) {
      return principal / numPayments
    }

    const monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
      (Math.pow(1 + monthlyRate, numPayments) - 1)

    return monthlyPayment
  }

  const principalAndInterest = calculateMortgage()
  const totalMonthlyPayment = principalAndInterest + propertyTaxes + homeInsurance + hoaDues + utilities
  const downPaymentPercent = ((downPayment / homePrice) * 100).toFixed(1)

  // Chart data for visualization
  const chartData = [
    { label: "Principal & Interest", amount: principalAndInterest, color: "#1e40af" },
    { label: "Property Taxes", amount: propertyTaxes, color: "#3b82f6" },
    { label: "Home Insurance", amount: homeInsurance, color: "#60a5fa" },
    ...(hoaDues > 0 ? [{ label: "HOA Dues", amount: hoaDues, color: "#93c5fd" }] : []),
    ...(utilities > 0 ? [{ label: "Utilities", amount: utilities, color: "#66BB6A" }] : []),
  ]

  const total = chartData.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column - Payment Breakdown Chart */}
      <div className="space-y-4">
        <div className="text-left">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly payment</h3>
        </div>

        {/* Donut Chart Visualization */}
        <div className="relative w-48 h-48 mx-auto">
          <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
            {chartData.map((item, index) => {
              const percentage = (item.amount / total) * 100
              const circumference = 2 * Math.PI * 80
              const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`
              const strokeDashoffset = -chartData
                .slice(0, index)
                .reduce((sum, prev) => sum + (prev.amount / total) * circumference, 0)

              return (
                <circle
                  key={item.label}
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke={item.color}
                  strokeWidth="20"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300"
                />
              )
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Est.</div>
              <div className="text-xl font-bold text-gray-900">${Math.round(totalMonthlyPayment).toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2">
          {chartData.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">${Math.round(item.amount).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column - Input Panel */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Loan Details</h3>

        <div className="space-y-3">
          {/* Home Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Home Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={homePrice}
                onChange={(e) => setHomePrice(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
              />
            </div>
          </div>

          {/* Down Payment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment ({downPaymentPercent}%)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
              />
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate</label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
            </div>
          </div>

          {/* Loan Term */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term</label>
            <select
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
            >
              <option value={15}>15 years</option>
              <option value={20}>20 years</option>
              <option value={30}>30 years</option>
            </select>
          </div>

          {/* Expand/Collapse Button */}
          <button
            type="button"
            onClick={() => setShowAdditionalFields(!showAdditionalFields)}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span>{showAdditionalFields ? "Hide" : "Show"} Additional Options</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showAdditionalFields ? "rotate-180" : ""}`} />
          </button>

          {/* Additional Fields - Collapsible */}
          {showAdditionalFields && (
            <div className="space-y-3 pt-3 border-t border-gray-200">
              {/* Property Taxes (monthly) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Taxes (monthly)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={propertyTaxes}
                    onChange={(e) => setPropertyTaxes(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                  />
                </div>
              </div>

              {/* Home Insurance (monthly) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Home Insurance (monthly)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={homeInsurance}
                    onChange={(e) => setHomeInsurance(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                  />
                </div>
              </div>

              {/* HOA Dues (monthly) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">HOA Dues (monthly)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={hoaDues}
                    onChange={(e) => setHoaDues(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                  />
                </div>
              </div>

              {/* Utilities (monthly) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Utilities (monthly)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={utilities}
                    onChange={(e) => setUtilities(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                  />
                </div>
              </div>

              {/* Credit Score Range */}
              
            </div>
          )}
        </div>

        {/* Calculate Button */}
        

        {/* Additional Info */}
        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
          <p className="mb-1">
            <strong>Loan Amount:</strong> ${(homePrice - downPayment).toLocaleString()}
          </p>
          <p>
            <strong>Total Interest:</strong> $
            {Math.round(principalAndInterest * loanTerm * 12 - (homePrice - downPayment)).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}
