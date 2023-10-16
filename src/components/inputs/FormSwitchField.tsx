import { useState } from "react";
import { FormControl, FormHelperText, InputLabel, Switch } from "@mui/material";
import { Controller } from "react-hook-form";

interface FormInputSwitchProps {
  name: string;
  label: string;
  helperText: string | undefined;
  disabled: boolean;
  error: boolean;
  control: any;
  setValue: (label: string, obj: any) => any;
}

const FormSwitchField = ({
  error,
  helperText,
  label,
  control,
  setValue,
  disabled,
  name,
}: FormInputSwitchProps) => {
  const [status, setStatus] = useState<boolean>(false);
  return (
    <FormControl
      fullWidth
      className="custom_select"
      variant="outlined"
      size="small"
      error={error}
    >
      <InputLabel
        id={name}
        className="mb-2"
        shrink={true}
        sx={{ color: disabled ? "gray" : "black" }}
      >
        {label}
      </InputLabel>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange } }) => {
          return (
            <Switch
              checked={value ?? false}
              disabled={disabled}
              onChange={(event: any, val: any) => {
                setValue(name, val);
                setStatus(val);
                return onChange(val);
              }}
            />
          );
        }}
      />
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
};

export default FormSwitchField;
