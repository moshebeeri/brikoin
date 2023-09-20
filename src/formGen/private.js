const privateInvest = {
  label: "PersonalDetails",
  title: "PrivateInvestment",
  summary: true,
  fields: [
    {
      type: "text",
      label: "name",
      mandatory: true,
      dataType: "privateName"
    },
    {
      type: "text",
      label: "lastName",
      dataType: "privateLastName"
    },
    {
      type: "text",
      label: "ID",
      dataType: "privateId"
    },

    {
      type: "text",
      label: "email",
      dataType: "privateEmail"
    },
    {
      type: "text",
      label: "PhoneNumber",
      dataType: "privatePhone"
    },
    {
      type: "text",
      label: "address",
      dataType: "privateAddress"
    },

    {
      type: "fileUpload",
      label: "IdDocument",
      mandatory: true,
      dataType: "privateIdDocument"
    }
  ],
  condition: {
    type: "radio",
    key: "optionPrivate",
    label: "RealestateInvestmentType",
    values: [
      {
        key: "OFFICE",
        label: "office"
      },
      { key: "APARTMENT", label: "Apartment" }
    ],
    results: [
      {
        key: "OFFICE",
        value: "office"
      },
      {
        key: "APARTMENT",
        value: "apartment"
      }
    ]
  }
};

export default privateInvest;
