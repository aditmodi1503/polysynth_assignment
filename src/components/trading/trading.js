import React, { useEffect, useState, useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import RadioGroup, { useRadioGroup } from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { FormLabel } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const Trading = () => {
  const [formValues, setFormValues] = useState({
    Amount_USDP: "",
    error_Amount_USDP: "",
    touched_Amount_USDP: false,
    Amount_ETH: "",
    error_Amount_ETH: "",
    touched_Amount_ETH: false,
    Leverage: 1,
    error_Leverage: false,
    touched_Leverage: false,
    Slippage: 0.1,
    error_Slippage: false,
    touched_Slippage: false,
    lastChanged: "",
  });

  const [submitButton, setSubmitButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSucces, setShowSuccess] = useState(false);

  const Amount_USDP = "Amount_USDP";
  const Amount_ETH = "Amount_ETH";
  const Slippage = "Slippage";
  const numberRegex = /^[+-]?\d*(?:[.,]\d*)?$/;

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    if (numberRegex.test(value)) {
			if(name == Amount_USDP){
				setFormValues((formValues) => ({
					...formValues,
					[`error_${name}`]: hasError(name),
					[`touched_${name}`]: true,
					[name]: value,
					lastChanged: name,
					Amount_ETH: returnValue(event)
				}));
			}
			else if(name == Amount_ETH){
				setFormValues((formValues) => ({
					...formValues,
					[`error_${name}`]: hasError(name),
					[`touched_${name}`]: true,
					[name]: value,
					lastChanged: name,
					Amount_USDP: returnValue(event),
				}));
			}
      
    }
  };

  useEffect(() => {
    if (formValues.lastChanged == Amount_USDP) {
      setFormValues((formValues) => ({
        ...formValues,
        Amount_ETH: returnValue(Amount_ETH, formValues.Amount_USDP),
      }));
    } else if (formValues.lastChanged == Amount_ETH) {
      setFormValues((formValues) => ({
        ...formValues,
        Amount_USDP: returnValue(Amount_USDP, formValues.Amount_ETH),
      }));
    }
  }, [formValues.Leverage]);

  useEffect(() => {
    if (
      formValues.Slippage &&
      formValues.Slippage != "0" &&
      formValues.Amount_USDP &&
      formValues.Amount_ETH
    ) {
      setSubmitButton(true);
    } else {
      setSubmitButton(false);
    }
  }, [formValues.Slippage, formValues.Amount_USDP, formValues.Amount_ETH]);

  useEffect(() => {
    if (submitButton) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        setShowSuccess(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
	}, [isLoading]);
	
	const returnValue = useCallback((event) => returnValueCallback(event.target.name, event.target.value), [formValues.Amount_ETH, formValues.Amount_USDP ])

  const returnValueCallback = (name, value) => {
    let response = 0;
    switch (name) {
      case Amount_USDP:
        response = (value * formValues.Leverage) / 1000;
        break;
      case Amount_ETH:
        response = (value * 1000) / formValues.Leverage;
        break;
      default:
        break;
    }
    return response;
  };

  const setError = (field, value) => {
    let error = "";
    if (!formValues[field]) {
      error = "required";
    } else {
      switch (field) {
        case Amount_USDP:
          if (!numberRegex.test(value)) {
            error = "only numbers allowed";
          }
          break;
        case Amount_ETH:
          if (!numberRegex.test(value)) {
            error = "only numbers allowed";
          }
          break;
        default:
          break;
      }
    }
    return error;
  };

  const handleSlider = (event) => {
		const {value} = event.target; 
    setFormValues((formValues) => ({
      ...formValues,
      Leverage: value,
      error_Leverage: false,
      touched_Leverage: true,
    }));
	}

  const setSliderValue = (value) => {
    return `${value}X`;
  };

  const hasError = (field) => {
    let error = "";
    let value = formValues[field];
    if (
      !formValues[field] &&
      formValues[`touched_${field}`] &&
      setError(field, value) != ""
    ) {
      error = setError(field, value);
    }
    return error;
  };

  const handleSlippage = (event) => {
    const { value, name } = event.target;
    if (value <= 5) {
      setFormValues((formValues) => ({
        ...formValues,
        [name]: value,
        [`touched_${name}`]: true,
      }));
    }
  };

  const handleSubmit = () => {
    setIsLoading(true);
    console.log(123, formValues);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          bgcolor: "#cfe8fc",
          height: "auto",
          width: "50vh",
          padding: "20px",
          margin: "auto",
        }}
      >
        <Grid container justify="space-around" spacing={4}>
          <Grid item xs={12}>
            <TextField
              error={hasError(Amount_USDP) ? true : false}
              id="standard-error-helper-text"
              label={Amount_USDP}
              helperText={hasError(Amount_USDP)}
              variant="standard"
              value={formValues.Amount_USDP}
              name={Amount_USDP}
              placeholder="0"
              onChange={(event) => handleChange(event)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={hasError(Amount_USDP) ? true : false}
              id="standard-error-helper-text"
              label={Amount_ETH}
              helperText={hasError(Amount_ETH)}
              variant="standard"
              value={formValues.Amount_ETH}
              name={Amount_ETH}
              placeholder="0"
              onChange={(event) => handleChange(event)}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={11}>
                <FormLabel>Leverage</FormLabel>
              </Grid>
              <Grid item xs={1}>
                <FormLabel>{formValues.Leverage}X</FormLabel>
              </Grid>
            </Grid>
            <Slider
              getAriaValueText={setSliderValue}
              step={0.5}
              marks
              min={1}
              max={10}
              valueLabelDisplay="off"
              onChange={(event, value) => handleSlider(event)}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={11}>
                <FormLabel>Slippage tolerance</FormLabel>
              </Grid>
              <Grid item xs={1}>
                <FormLabel>{formValues.Slippage}%</FormLabel>
              </Grid>
            </Grid>
            <RadioGroup
              row
              name="Slippage"
              value={formValues.Slippage}
              onChange={handleSlippage}
            >
              <FormControlLabel value="0.1" label="0.1%" control={<Radio />} />
              <FormControlLabel value="0.5" label="0.5%" control={<Radio />} />
              <FormControlLabel value="1" label="1%" control={<Radio />} />
              <FormControlLabel
                label="Other(0% to 5%)"
                control={
                  <TextField
                    onChange={handleSlippage}
                    name="Slippage"
                    value={formValues.Slippage}
                    error={hasError(Slippage) ? true : false}
                    id="standard-error-helper-text"
                    helperText={hasError(Slippage)}
                  />
                }
              />
            </RadioGroup>
          </Grid>
          <Grid item xs={12}>
            {isLoading ? (
              <Box sx={{ display: "flex" }}>
                <CircularProgress />
              </Box>
            ) : (
              <Button
                disabled={!submitButton}
                variant="contained"
                onClick={handleSubmit}
              >
                PLACE MARKET ORDER
              </Button>
            )}
          </Grid>
          <Grid item xs={12}>
            {showSucces ? (
              <Alert severity="success" color="info">
                Success
              </Alert>
            ) : null}
          </Grid>
          <Grid item xs={12}>
            {showSucces ? (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 100 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="right">
                        <b>Amount USDP</b>
                      </TableCell>
                      <TableCell align="right">
                        <b>Amount ETH</b>
                      </TableCell>
                      <TableCell align="right">
                        <b>Leverage</b>
                      </TableCell>
                      <TableCell align="right">
                        <b>Slippage Tolerance</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row" align="right">
                        {formValues.Amount_USDP}
                      </TableCell>
                      <TableCell align="right">
                        {formValues.Amount_ETH}
                      </TableCell>
                      <TableCell align="right">{formValues.Leverage}</TableCell>
                      <TableCell align="right">{formValues.Slippage}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            ) : null}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Trading;
