const privateInvest = {
  label: "ApartmentDetails",
  title: "ApartmentDetailsInvest",
  summary: true,
  fields: [
    {
      type: "text",
      label: "city",
      dataType: "city"
    },
    {
      type: "text",
      label: "address",
      dataType: "address"
    },
    {
      type: "selector",
      label: "appGroundOwnership",
      dataType: "כgroundOwnership",
      mandatory: true,
      selections: [
        {
          label: "private",
          value: "PRIVATE"
        },
        {
          label: "countryAdmin",
          value: "ADMIN"
        }
      ]
    },
    {
      type: "fileUpload",
      label: "TabuDetails",
      dataType: "tabu"
    },

    {
      type: "fileUpload",
      label: "ApartmentProgram",
      dataType: "program"
    }
  ],
  condition: {
    type: "done"
  }
};

export default privateInvest;
