import React, { useEffect, useReducer, useState } from "react";
import {
  listenForDocumentAttributes,
  listenForDocuments,
  listenForOperations
} from "./operationUtils";
import { connect } from "react-redux";
import LoadingCircular from "../../UI/loading/LoadingCircular";

export function Develop(props) {
  const [loading, setLoading] = useState(true);

  return (
    <div
      style={{
        display: "flex",
        minHeight: 300,
        marginTop: "10%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start"
      }}
    >
      {loading ? <LoadingCircular open /> : <div>Hello develop</div>}
    </div>
  );
}

const mapStateToProps = (state, props) => ({
  projects: getAllProject(state, props),
  lang: state.userProfileReducer.lang
});

const mapDispatchToProps = {};

export default withUser(connect(mapStateToProps, mapDispatchToProps)(Develop));
