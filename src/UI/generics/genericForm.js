import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import GenericTextField from "./GenericTextField";
import GenericAddress from "./GenericAddress";
import GenericSelector from "./GenericSelector";
import GenericCheckBox from "./GenericCheckBox";
import GenericDateTimePicker from "./GenericDateTimePicker";
import GenericSignature from "./GenericSigniture";
import GenericWebCap from "./GenericWebCap";
import DynamicForm from "./DynamicForm";
import UserSelector from "../user/UserSelector";
import GenericFileLoader from "./GenericFileLoader";
import numberUtils from "../../utils/numberUtils";
import { withCusomeStyle } from "../warappers/withCusomeStyle";
import { connect } from "react-redux";

class GenericForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = name => event => {
    this.getSetState({
      [name]: event.target.value
    });
  };

  getSetState() {
    const { setState } = this.props;
    return setState || this.setState;
  }

  getState() {
    const { state } = this.props;
    return state || this.state;
  }

  saveEntity() {
    const { mandatoryFields, entityDescriptor, entity } = this.props;
    if (mandatoryFields) {
      let fieldsValues = mandatoryFields.map(field => this.getState()[field]);
      if (fieldsValues.includes("") || fieldsValues.includes(undefined)) {
        this.getSetState({ mandatoryError: true });
        return;
      }
    }
    const savedEntity = {};
    Object.keys(entityDescriptor).forEach(fieldKey => {
      if (entityDescriptor[fieldKey] === "address") {
        savedEntity[fieldKey + "LocationLat"] =
          this.getState()[fieldKey + "LocationLat"] ||
          entity[fieldKey + "LocationLat"];
        savedEntity[fieldKey + "LocationLng"] =
          this.getState()[fieldKey + "LocationLng"] ||
          entity[fieldKey + "LocationLng"];
      }
      savedEntity[fieldKey] = this.getState()[fieldKey] || entity[fieldKey];
      if (!savedEntity[fieldKey]) {
        savedEntity[fieldKey] = "";
      }
      if (typeof savedEntity[fieldKey] === "function") {
        savedEntity[fieldKey] = "";
      }
    });
    this.getSetState({ mandatoryError: false });
    if (this.props.save) {
      this.props.save(savedEntity);
    }
  }

  render() {
    const {
      entity,
      direction,
      title,
      classes,
      entityDescriptor,
      buttonTitle
    } = this.props;
    return (
      <div
        dir={direction}
        style={{
          display: "flex",
          // borderColor: '#e5e5e5',
          // borderWidth: 1,
          maxWidth: this.props.width === "xs" ? 300 : 1000,
          // borderStyle: 'solid',
          alignItems: "flex-start",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        {title && (
          <div style={{ margin: 10 }}>
            <Typography
              className={classes.textFieldClass}
              align="left"
              variant="h5"
            >
              {this.props.t(title)}
            </Typography>
          </div>
        )}
        <div style={{ marginRight: 10, marginLeft: 10 }}>
          <Grid
            container
            direction="row"
            alignItems="center"
            justify="flex-start"
            spacing={16}
          >
            {Object.keys(entityDescriptor).map(fieldKey => (
              <Grid key={fieldKey} item>
                {this.renderField(fieldKey, entity[fieldKey])}
              </Grid>
            ))}
          </Grid>
        </div>

        <div
          style={{
            flex: 1,
            marginTop: 20,
            marginLeft: 60,
            marginRight: 60,
            width: 280,
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "flex-start"
          }}
        >
          {this.props.save && (
            <Button
              fullWidth
              variant="outlined"
              className={classes.button}
              onClick={this.saveEntity.bind(this)}
            >
              {this.props.t(buttonTitle || "update")}
            </Button>
          )}
        </div>
      </div>
    );
  }

  getComponentStyle(fieldKey, fieldValue) {
    const { classes } = this.props;
    return this.state.mandatoryError && !this.state[fieldKey] && !fieldValue
      ? classes.componentBoxError
      : classes.componentBox;
  }

  renderField(fieldKey, fieldValue) {
    const {
      entityDescriptor,
      viewOnly,
      classes,
      dynamicForm,
      selectorValues
    } = this.props;
    if (entityDescriptor[fieldKey] === "paragraph") {
      return (
        <div className={classes.paragraphBox}>
          {this.renderParagrapp(fieldKey)}
        </div>
      );
    }
    if (entityDescriptor[fieldKey] === "readOnly-text") {
      return (
        <div className={classes.textReadOnly}>
          {this.renderTextView(fieldKey, fieldValue)}
        </div>
      );
    }
    if (entityDescriptor[fieldKey] === "readOnly-text-number") {
      return (
        <div className={classes.textReadOnly}>
          {this.renderTextNumberView(fieldKey, fieldValue)}
        </div>
      );
    }
    if (entityDescriptor[fieldKey] === "readOnly-text-boolean") {
      return (
        <div className={classes.textReadOnly}>
          {this.renderTextViewBoolean(fieldKey, fieldValue)}
        </div>
      );
    }
    if (entityDescriptor[fieldKey] === "breakLine") {
      return <div className={classes.componentBox} />;
    }
    if (entityDescriptor[fieldKey] === "text") {
      return (
        <div className={this.getComponentStyle(fieldKey, fieldValue)}>
          {this.renderTextField(fieldKey, fieldValue, viewOnly)}
        </div>
      );
    }
    if (entityDescriptor[fieldKey] === "address") {
      return (
        <div className={this.getComponentStyle(fieldKey, fieldValue)}>
          {this.renderAddress(fieldKey, fieldValue, viewOnly)}
        </div>
      );
    }
    if (entityDescriptor[fieldKey] === "text-area") {
      return (
        <div
          className={
            this.props.width === "xs"
              ? classes.componentBoxAreaSmall
              : classes.componentBoxArea
          }
        >
          {this.renderTextField(fieldKey, fieldValue, viewOnly, "text", true)}
        </div>
      );
    }
    if (entityDescriptor[fieldKey] === "text-number") {
      return (
        <div className={this.getComponentStyle(fieldKey, fieldValue)}>
          {this.renderTextField(fieldKey, fieldValue, viewOnly, "number")}
        </div>
      );
    }
    if (entityDescriptor[fieldKey] === "textView") {
      return (
        <div className={this.getComponentStyle(fieldKey, fieldValue)}>
          {this.renderTextField(fieldKey, fieldValue, true)}
        </div>
      );
    }
    if (entityDescriptor[fieldKey] === "textView-translate") {
      return (
        <div className={this.getComponentStyle(fieldKey, fieldValue)}>
          {this.renderTextField(fieldKey, this.props.t(fieldValue), true)}
        </div>
      );
    }
    if (entityDescriptor[fieldKey] === "fileUpload") {
      return (
        <div
          className={
            this.props.width === "xs"
              ? classes.componentBoxFileSmall
              : classes.componentBoxFileValue
          }
        >
          {this.renderFileUpload(fieldKey, fieldValue, classes, true)}
        </div>
      );
    }
    if (entityDescriptor[fieldKey] === "filesUpload") {
      return (
        <div
          className={
            this.props.width === "xs"
              ? classes.componentBoxFileSmall
              : classes.componentBoxFileValue
          }
        >
          {this.renderFileUpload(fieldKey, fieldValue, classes, true, true)}
        </div>
      );
    }
    if (entityDescriptor[fieldKey] === "imageUpload") {
      return (
        <div
          className={
            this.props.width === "xs"
              ? classes.componentBoxFileSmall
              : classes.componentBoxFileValue
          }
        >
          {this.renderImageUpload(fieldKey, fieldValue)}
        </div>
      );
    }
    if (entityDescriptor[fieldKey] === "fileUpload-View") {
      return (
        <div
          className={
            this.props.width === "xs"
              ? classes.componentBoxFileSmall
              : classes.componentBoxFileValue
          }
        >
          {this.renderFileUpload(fieldKey, fieldValue, classes, false)}
        </div>
      );
    }
    if (entityDescriptor[fieldKey] === "selector") {
      return (
        <div className={this.getComponentStyle(fieldKey, fieldValue)}>
          {this.createSelector(fieldKey, fieldValue)}
        </div>
      );
    }
    if (entityDescriptor[fieldKey] === "checkBox") {
      return (
        <div className={this.getComponentStyle(fieldKey, fieldValue)}>
          {this.renderCheckBox(fieldKey, fieldValue)}
        </div>
      );
    }
    if (entityDescriptor[fieldKey] === "dateTimePicker") {
      return (
        <div className={this.getComponentStyle(fieldKey, fieldValue)}>
          {this.renderDateTimePicker(fieldKey, fieldValue)}
        </div>
      );
    }
    if (entityDescriptor[fieldKey] === "signature") {
      return (
        <div className={this.getComponentStyle(fieldKey, fieldValue)}>
          <GenericSignature
            t={this.props.t}
            state={this.getState()}
            setState={this.getSetState().bind(this)}
            fieldKey={fieldKey}
            fieldValue={fieldValue}
          />
        </div>
      );
    }
    if (entityDescriptor[fieldKey] === "webCap") {
      return (
        <div className={this.getComponentStyle(fieldKey, fieldValue)}>
          <GenericWebCap
            t={this.props.t}
            state={this.getState()}
            setState={this.getSetState().bind(this)}
            fieldKey={fieldKey}
            fieldValue={fieldValue}
          />
        </div>
      );
    }
    if (entityDescriptor[fieldKey] === "date") {
      const { mandatoryFields } = this.props;
      return (
        <div
          key={fieldKey}
          className={this.getComponentStyle(fieldKey, fieldValue)}
        >
          <GenericTextField
            render={this.props.render}
            required={
              mandatoryFields ? mandatoryFields.includes(fieldKey) : false
            }
            state={this.getState()}
            setState={this.getSetState().bind(this)}
            t={this.props.t}
            fieldKey={fieldKey}
            fieldValue={fieldValue}
            textType={"date"}
          />
        </div>
      );
    }
    if (entityDescriptor[fieldKey] === "userSelection") {
      const filterValue = this.props.selectionFilter
        ? this.props.selectionFilter[fieldKey]
        : "";
      return (
        <div className={this.getComponentStyle(fieldKey, fieldValue)}>
          <UserSelector
            filter={filterValue}
            t={this.props.t}
            state={this.getState()}
            setState={this.getSetState().bind(this)}
            fieldKey={fieldKey}
            fieldValue={fieldValue}
          />
        </div>
      );
    }
    if (entityDescriptor[fieldKey] === "dynamicForm") {
      return (
        <div
          className={
            this.props.width === "xs"
              ? classes.dynamicForm
              : classes.dynamicForm
          }
        >
          <DynamicForm
            t={this.props.t}
            form={dynamicForm[fieldKey]}
            state={this.getState()}
            selectorValues={selectorValues}
            setState={this.getSetState().bind(this)}
            title={fieldKey}
            dynamicForm={dynamicForm}
            fieldValue={fieldValue}
            viewOnly={viewOnly}
          />
        </div>
      );
    }
    return <div />;
  }

  renderCheckBox(fieldKey, fieldValue) {
    return (
      <GenericCheckBox
        t={this.props.t}
        fieldKey={fieldKey}
        fieldValue={fieldValue}
        direction={this.props.direction}
        state={this.getState()}
        setState={this.getSetState().bind(this)}
      />
    );
  }

  renderDateTimePicker(fieldKey, fieldValue) {
    return (
      <GenericDateTimePicker
        t={this.props.t}
        fieldKey={fieldKey}
        fieldValue={fieldValue}
        state={this.getState()}
        setState={this.getSetState().bind(this)}
      />
    );
  }

  renderTextField(fieldKey, fieldValue, viewOnly, type, textArea) {
    const { mandatoryFields } = this.props;
    console.log("should change");
    return (
      <GenericTextField
        state={this.state}
        textArea={textArea}
        setState={this.getSetState().bind(this)}
        required={mandatoryFields ? mandatoryFields.includes(fieldKey) : false}
        t={this.props.t}
        fieldKey={fieldKey}
        fieldValue={fieldValue}
        viewOnly={viewOnly}
        textType={type}
      />
    );
  }

  renderAddress(fieldKey, fieldValue, viewOnly) {
    const { mandatoryFields } = this.props;
    return (
      <GenericAddress
        state={this.state}
        mandatory={mandatoryFields ? mandatoryFields.includes(fieldKey) : false}
        setState={this.getSetState().bind(this)}
        t={this.props.t}
        fieldKey={fieldKey}
        fieldValue={fieldValue}
        viewOnly={viewOnly}
      />
    );
  }

  renderParagrapp(fieldKey) {
    const { classes } = this.props;
    return (
      <Typography
        className={classes.textFieldClass}
        align="left"
        variant="body1"
      >
        {this.props.t(fieldKey)}
      </Typography>
    );
  }

  renderTextView(fieldKey, fieldValue) {
    const { classes, symbols } = this.props;
    return (
      <Typography className={classes.textFieldClass} variant="body1">
        {this.props.t(fieldKey)}: {this.props.t(fieldValue)}
        {symbols[fieldKey]}
      </Typography>
    );
  }

  renderTextNumberView(fieldKey, fieldValue) {
    const { classes, symbols } = this.props;
    return (
      <Typography className={classes.textFieldClass} variant="body1">
        {this.props.t(fieldKey)}: {numberUtils.formatNumber(fieldValue, 0)}
        {symbols[fieldKey]}
      </Typography>
    );
  }

  renderTextViewBoolean(fieldKey, fieldValue) {
    const { classes } = this.props;
    return (
      <Typography className={classes.textFieldClass} variant="body1">
        {this.props.t(fieldKey)}:{" "}
        {fieldValue ? this.props.t("true") : this.props.t("false")}
      </Typography>
    );
  }

  renderFileUpload(fieldKey, fieldValue, editable, multiple) {
    return (
      <GenericFileLoader
        width={this.props.width}
        maxFiles={1}
        edit={editable}
        multiple={multiple}
        fieldKey={fieldKey}
        fieldValue={fieldValue}
        t={this.props.t}
        state={this.getState()}
        setState={this.getSetState().bind(this)}
      />
    );
  }

  renderImageUpload(fieldKey, fieldValue) {
    return (
      <GenericFileLoader
        width={this.props.width}
        maxFiles={5}
        fieldKey={fieldKey}
        state={this.getState()}
        fieldValue={fieldValue}
        setState={this.getSetState().bind(this)}
        t={this.props.t}
      />
    );
  }

  createSelector(fieldKey, fieldValue) {
    const { viewOnly, selectorValues, mandatoryFields } = this.props;
    return (
      <GenericSelector
        t={this.props.t}
        state={this.getState()}
        setState={this.getSetState().bind(this)}
        fieldKey={fieldKey}
        required={mandatoryFields ? mandatoryFields.includes(fieldKey) : false}
        fieldValue={fieldValue}
        viewOnly={viewOnly}
        selectorValues={selectorValues}
      />
    );
  }

  componentDidMount() {
    const { entity } = this.props;
    if (entity.id) {
      this.getSetState({ id: entity.id });
    }
  }
}

const mapStateToProps = state => {
  return {
    direction: state.userProfileReducer.direction
  };
};
const mapDispatchToProps = {};
export default withCusomeStyle(
  connect(mapStateToProps, mapDispatchToProps)(GenericForm)
);
