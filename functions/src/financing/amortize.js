// SEE: http://petermoresi.github.io/loan-calculator/loan-calculator.html

function pmt (rate, nper, pv) {
  let pvif, pmt

  pvif = Math.pow(1 + rate, nper)
  pmt = rate / (pvif - 1) * -(pv * pvif)

  return pmt
}

function computeSchedule (loanAmount, interestRate, paymentsPerYear, years, payment) {
  let schedule = []
  let remaining = loanAmount
  let numberOfPayments = paymentsPerYear * years

  for (let i = 0; i <= numberOfPayments; i++) {
    let interest = remaining * (interestRate / 100 / paymentsPerYear)
    let principle = (payment - interest)
    let row = [i, principle > 0 ? (principle < payment ? principle : payment) : 0, interest > 0 ? interest : 0, remaining > 0 ? remaining : 0]
    row[1] = row[1].toFixed(2)
    row[2] = row[2].toFixed(2)
    row[3] = row[3].toFixed(2)
    schedule.push(row)
    remaining -= principle
  }

  return schedule
}

function amortize (
  loanAmount,
  interestRate,
  paymentsPerYear,
  years) {
  let output = {}
  output.years = years
  let numberOfPayments = output.numberOfPayments = paymentsPerYear * years
  let payment = output.payment = pmt(interestRate / 100 / paymentsPerYear, numberOfPayments, -loanAmount)

  output.schedule = computeSchedule(loanAmount,
    interestRate,
    paymentsPerYear,
    years,
    payment)
  return output
}
let ds = amortize(100000, 5, 12, 25)
ds.schedule.forEach(d => console.log(JSON.stringify(d)))
