import React from "react";

export class MyCustomTaskInfoPanelItem extends React.Component {
  render() {
    return (
      <div>
        <br />
        <hr />
        <h3>TO DO</h3>
        <ul>
          <li>Answer the task</li>
          <li>Locate the customer's record in the CRM</li>
          <li>Find relevant account details</li>
          <li>Resolve the customer's support issue</li>
          <li>Complete the task</li>
        </ul>
      </div>
    );
  }
}
