import {
  Autocomplete,
  FormControl,
  FormHelperText,
  InputLabel,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";

interface FormAutoCompleteFieldProps {
  options: Array<any>;
  register: any;
  label: string;
  error: boolean;
  helperText: string;
  id: string;
  disabled?: boolean;
  required: boolean;
  control: any;
  setValue: any;
  watch: any;
}

const FormAutoCompleteField = ({
  options,
  label,
  error,
  helperText,
  register,
  id,
  disabled,
  required,
  control,
  setValue,
  watch,
}: FormAutoCompleteFieldProps) => {
  const [inputValue, setInputValue] = useState<any>("");
  const [temp, setTemp] = useState<any>("");

  // Sorting the option alphabetically according to the label
  useEffect(() => {
    options.sort((a, b) => {
      const labelA = a.label.toLowerCase();
      const labelB = b.label.toLowerCase();
      if (labelA > labelB) return 1;
      if (labelA < labelB) return -1;
      return 0;
    });
  }, [options]);

  const val = watch(id);

  useEffect(() => {
    if (val) {
      if (typeof val === "object") {
        setTemp(val);
      } else {
        setTemp(options.find((e) => e.value == val) ?? "");
      }
    } else {
      setTemp(val);
    }
  }, [val, options]);

  return (
    <FormControl
      fullWidth
      variant="outlined"
      size="small"
      error={error}
      required={required}
      disabled={disabled}
    >
      <Controller
        control={control}
        name={id}
        render={({ field: { value, onChange } }) => {
          return (
            <Autocomplete
              disabled={disabled}
              // fullWidth
              value={temp ?? ""}
              onChange={(event: any, newValue: any) => {
                setValue(id, newValue?.value ?? "");
              }}
              inputValue={inputValue}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              id={id}
              freeSolo
              autoHighlight
              clearOnBlur={true}
              loadingText={"Loading..."}
              options={options}
              sx={{
                padding: 0,
                margin: 0,
                paddingTop: 0,
              }}
              renderInput={(params) => (
                <TextField
                  error={error}
                  required={required}
                  label={label}
                  {...params}
                  sx={{
                    margin: 0,
                  }}
                  InputLabelProps={{
                    shrink: true,
                    style: { color: disabled ? "gray" : "black" },
                  }}
                  size={"small"}
                />
              )}
            />
          );
        }}
      />
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
};

export default FormAutoCompleteField;
