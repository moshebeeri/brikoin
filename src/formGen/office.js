const privateInvest = {
  label: "OfficeDetails",
  title: "OfficeDetailsInvest",
  summary: true,
  fields: [
    {
      type: "text",
      label: "city",
      dataType: "officeCity"
    },
    {
      type: "text",
      label: "address",
      dataType: "officeAddress"
    }
  ],
  condition: {
    type: "done"
  }
};

export default privateInvest;
