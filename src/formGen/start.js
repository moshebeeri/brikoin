const start = {
  title: "FundingWizard",
  label: "FundingWizard",
  summary: false,
  fields: [],
  condition: {
    type: "radio",
    key: "optionStart",
    label: "InvestmentType",
    values: [
      {
        key: "PRIVATE",
        label: "PrivateInvestment"
      },
      { key: "BUSINESS", label: "BusinessInvestment" }
    ],
    results: [
      {
        key: "PRIVATE",
        value: "private"
      },
      {
        key: "BUSINESS",
        value: "business"
      }
    ]
  }
};

export default start;
