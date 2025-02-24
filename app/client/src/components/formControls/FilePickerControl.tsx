import * as React from "react";
import { WrappedFieldProps } from "redux-form";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import "@uppy/webcam/dist/style.css";
import { Field } from "redux-form";
import styled from "styled-components";
import Uppy from "@uppy/core";
import Dashboard from "@uppy/dashboard";
import BaseControl, { ControlProps } from "./BaseControl";
import { ControlType } from "constants/PropertyControlConstants";
import FormLabel from "components/editorComponents/FormLabel";
import { BaseButton } from "components/designSystems/appsmith/BaseButton";
import { ButtonVariantTypes } from "components/constants";
import { Colors } from "constants/Colors";
import { replayHighlightClass } from "globalStyles/portals";

const StyledDiv = styled.div`
  flex: 1;
  border: 1px solid #d3dee3;
  border-right: none;
  padding: 6px 12px;
  font-size: 14px;
  color: #768896;
`;

const SelectButton = styled(BaseButton)`
  &&&& {
    max-width: 59px;
    margin: 0 0px;
    min-height: 32px;
    border-radius: 0px 4px 4px 0px;
    font-weight: bold;
    background-color: #fff;
    border-color: ${Colors.PRIMARY_ORANGE} !important;
    font-size: 14px;
    &.bp3-button {
      padding: 0px 0px;
    }
    span {
      color: ${Colors.PRIMARY_ORANGE} !important;
      font-weight: 400;
    }
    &:hover:enabled,
    &:active:enabled {
      background: rgba(248, 106, 43, 0.1) !important;
    }
  }
`;

interface FieldFileInputState {
  text: string;
}

type Props = WrappedFieldProps;

class FieldFileInput extends React.Component<Props, FieldFileInputState> {
  uppy: any;

  constructor(props: Props) {
    super(props);
    this.refreshUppy();

    this.state = {
      text: "Select file to upload",
    };
  }

  refreshUppy = () => {
    this.uppy = Uppy({
      id: "test",
      autoProceed: false,
      debug: false,
      restrictions: {
        maxNumberOfFiles: 1,
      },
    }).use(Dashboard, {
      hideUploadButton: true,
    });
    this.uppy.on("file-added", (file: any) => {
      const dslFiles = [];
      const reader = new FileReader();
      reader.readAsDataURL(file.data);
      reader.onloadend = () => {
        const base64data = reader.result;
        const newFile = {
          id: file.id,
          base64: base64data,
          blob: file.data,
        };
        dslFiles.push(newFile);
        this.uppy.getPlugin("Dashboard").closeModal();
        this.props.input.onChange({
          name: file.name,
          base64Content: base64data,
        });
      };
    });
  };

  openModal = () => {
    // this.setState({ isOpen: true });
    this.uppy.getPlugin("Dashboard").openModal();
  };

  render() {
    const {
      input: { value },
    } = this.props;

    return (
      <div
        className={replayHighlightClass}
        style={{ flexDirection: "row", display: "flex", width: "50vh" }}
      >
        <StyledDiv>{value.name}</StyledDiv>
        <SelectButton
          buttonStyle="PRIMARY"
          buttonVariant={ButtonVariantTypes.SECONDARY}
          onClick={() => {
            this.openModal();
          }}
          text={"Select"}
        />
      </div>
    );
  }
}

class FilePickerControl extends BaseControl<FilePickerControlProps> {
  constructor(props: FilePickerControlProps) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  render() {
    const { configProperty, isRequired, label } = this.props;

    return (
      <>
        <FormLabel>
          {label} {isRequired && "*"}
        </FormLabel>
        <Field component={FieldFileInput} name={configProperty} />
      </>
    );
  }

  getControlType(): ControlType {
    return "FILE_PICKER";
  }
}

export interface FilePickerComponentState {
  isOpen: boolean;
}

export type FilePickerControlProps = ControlProps;

export default FilePickerControl;
