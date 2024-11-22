import React from "react";
import TextField from "@mui/material/TextField";
import { Box, MenuItem } from "@mui/material";

interface Option {
  value: string;
  label: string;
}

interface InputProps {
  label: string;
  name: string;
  placeholder?: string;
  select?: boolean;
  options?: Option[];
  value?: string | null;
  defaultValue?: string | number;
  disabled?: boolean;
  onChange?: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  classname?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  select = false,
  options,
  defaultValue,
  name,
  value,
  disabled,
  onChange,
  classname,
}) => {
  return (
    <Box
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "black", // Cor da borda
          },
          "&:hover fieldset": {
            borderColor: "black", // Cor da borda ao passar o mouse
          },
          "&.Mui-focused fieldset": {
            borderColor: "black", // Cor da borda quando o input estiver focado
          },
        },
        "& .MuiInputLabel-root": {
          color: "black",
        },
        "& .Mui-focused .MuiInputLabel-root": {
          color: "black",
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "black",
        },
      }}
    >
      <TextField
        label={label}
        variant="outlined"
        fullWidth
        placeholder={placeholder}
        select={select}
        defaultValue={defaultValue}
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className={classname}
      >
        {select && options
          ? options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))
          : null}
      </TextField>
    </Box>
  );
};

export default Input;
