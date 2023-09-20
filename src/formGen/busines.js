const business = {
  label: "BusinessDetails",
  title: "BusinessInvestment",
  summary: true,
  fields: [
    {
      type: "text",
      label: "companyName",
      dataType: "companyName"
    },
    {
      type: "text",
      label: "CompanyNumber",
      dataType: "companyNumber"
    },

    {
      type: "text",
      label: "CompanySite",
      dataType: "businessSite"
    },
    {
      type: "text",
      label: "PhoneNumber",
      dataType: "businessPhone"
    },
    {
      type: "text",
      label: "address",
      dataType: "address"
    },
    {
      type: "fileUpload",
      label: "CompanyIDDocument",
      dataType: "companyId"
    }
  ],
  condition: {
    type: "radio",
    key: "optionBusiness",
    label: "RealestateInvestmentType",
    values: [
      { key: "APARTMENT", label: "Apartment" },
      {
        key: "office",
        label: "Office"
      },
      { key: "logistics", label: "logistics" }
    ],
    results: [
      {
        key: "office",
        value: "office"
      },
      {
        key: "logistics",
        value: "Logistics"
      },

      {
        key: "APARTMENT",
        value: "apartment"
      }
    ]
  }
};

export default business;
