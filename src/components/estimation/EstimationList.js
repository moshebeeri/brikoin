import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "styled-components";
import { Checkbox as SemanticCheckbox, Label } from "semantic-ui-react";

import {
  changeNewEstimation,
  saveNewEstimation,
  setFirestore,
  setEstimationStatus
} from "../../redux/actions/estimations";

import { Checkbox, Link } from "@atoms";
import { Example, InputGroup } from "@molecules";

import extractLines from "../../extract";
import firestoreSaga from "../../redux/sagas/estimations/firestore.js?raw";
import realtimeSaga from "../../redux/sagas/estimations/realtime.js?raw";

const StyledSemanticCheckbox = styled(SemanticCheckbox)`
  margin-bottom: ${p => 2 * p.theme.spacing}px;

  &.ui.toggle {
    input:not(:checked) ~ label {
      color: white !important;

      &::before {
        background: rgba(255, 255, 255, 0.15) !important;
      }
    }

    input:checked ~ label,
    input:checked:focus ~ label {
      color: white !important;

      &::before {
        background-color: ${p => p.theme.colour.primary} !important;
      }
    }
  }
`;

const StyledInputGroup = styled(InputGroup)`
  margin: ${p => 2 * p.theme.spacing}px auto 0;
  width: ${p => 40 * p.theme.spacing}px;

  input {
    flex-grow: 1;
  }
`;

const Checklist = styled.ul`
  align-items: stretch;
  display: inline-flex;
  flex-flow: column nowrap;
  list-style: none;
  margin: ${p => 3 * p.theme.spacing}px 0 0;
  padding: 0;
  width: ${p => 40 * p.theme.spacing}px;
`;

const ChecklistItem = styled.li`
  text-align: left;

  &:not(:first-child) {
    margin-top: ${p => p.theme.spacing}px;
  }
`;

const firestoreDoc = extractLines(firestoreSaga);
const realtimeDoc = extractLines(realtimeSaga);

const firestoreSnippets = [firestoreDoc(10, 19), firestoreDoc(36, 45)];
const realtimeSnippets = [realtimeDoc(10, 20), realtimeDoc(32, 41)];

class EstimationList extends PureComponent {
  static propTypes = {
    changeNewEstimation: PropTypes.func.isRequired,
    newEstimation: PropTypes.string.isRequired,
    saveNewEstimation: PropTypes.func.isRequired,
    setEstimationStatus: PropTypes.func.isRequired,
    estimations: PropTypes.array.isRequired,
    useFirestore: PropTypes.bool.isRequired
  };

  toggleFirestore = (event, { checked }) => this.props.setFirestore(checked);

  render() {
    const {
      changeNewEstimation,
      newEstimation,
      saveNewEstimation,
      setEstimationStatus,
      estimations,
      useFirestore
    } = this.props;

    return (
      <Example
        title="Estimation list"
        className="estimation-list"
        snippets={useFirestore ? firestoreSnippets : realtimeSnippets}
      >
        <StyledSemanticCheckbox
          label="Use firestore"
          checked={useFirestore}
          onChange={this.toggleFirestore}
          toggle
        />
        <Label pointing="left" color="yellow" size="tiny" horizontal>
          Beta
        </Label>

        <p>
          Open this page in{" "}
          <Link href="#" target="blank">
            another tab or window
          </Link>{" "}
          to see the realtime database in action!
        </p>

        <StyledInputGroup
          value={newEstimation}
          onChange={e => changeNewEstimation(e.target.value)}
          placeholder="New estimation"
          onSubmit={saveNewEstimation}
        >
          Add item
        </StyledInputGroup>

        <Checklist>
          {estimations.map(estimation => (
            <ChecklistItem key={estimation.id}>
              <Checkbox
                id={estimation.id}
                checked={estimation.done}
                onChange={() =>
                  setEstimationStatus(estimation.id, !estimation.done)
                }
              >
                {estimation.label}
              </Checkbox>
            </ChecklistItem>
          ))}
        </Checklist>
      </Example>
    );
  }
}

const mapStateToProps = state => ({
  newEstimation: state.estimations.new,
  estimations: state.estimations.list,
  useFirestore: state.estimations.useFirestore
});
const mapDispatchToProps = {
  changeNewEstimation,
  saveNewEstimation,
  setEstimationStatus,
  setFirestore
};

export default connect(mapStateToProps, mapDispatchToProps)(EstimationList);
