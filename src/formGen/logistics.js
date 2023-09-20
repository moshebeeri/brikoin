const business = {
  label: "Business Details",
  summary: true,
  fields: [
    {
      type: "text",
      label: "Company Name",
      dataType: "companyName"
    },
    {
      type: "text",
      label: "Company Number",
      dataType: "companyNumber"
    },
    {
      type: "fileUpload",
      label: "Company ID Document",
      dataType: "companyId"
    },

    {
      type: "text",
      label: "Company Site",
      dataType: "site"
    },
    {
      type: "text",
      label: "PhoneNumber ",
      dataType: "phone"
    },
    {
      type: "text",
      label: "Address",
      dataType: "address"
    }
  ],
  condition: {
    type: "radio",
    key: "option",
    label: "Realestate Investment Type",
    values: [
      {
        key: "office",
        label: "Office"
      },
      { key: "logistics", label: "Logistics " }
    ],
    results: [
      {
        key: "office",
        value: "office"
      },
      {
        key: "logistics",
        value: "Logistics"
      }
    ]
  }
};

export default business;
