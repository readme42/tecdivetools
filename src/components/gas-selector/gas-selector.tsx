import React, { FC, InputHTMLAttributes } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import Input from '@mui/material/Input';

import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

enum Gas {
  O2,
  He
}

interface InputProps extends InputHTMLAttributes<number> {
  headline: string;
  o2: number;
  he: number;
  useSetpoint: boolean;
  setpoint: number;

  onGasChange: (o2: number, he: number, useSetpoint: boolean, setpoint?: number) => void
}

const PREFIX = 'GasSelector';
const classes = {
  root: `${PREFIX}-root`,
  input: `${PREFIX}-input`
}

const Root = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    title: {
      fontSize: 24,
    },
  },
  [`&.${classes.input}`]: {
    input: {
      width: 402,
    },
  }
}));

const GasSelector: FC<InputProps> = ({ headline, o2, he, useSetpoint, setpoint, onGasChange, ...rest }) => {

  const handleO2SliderChange = (event: any, newValue: any) => {
    handleGasChange(Gas.O2, newValue);
  };

  const handleHeSliderChange = (event: any, newValue: any) => {
    handleGasChange(Gas.He, newValue);
  };

  const handleGasInputChange = (gas: Gas, event: any) => {
    handleGasChange(gas, event.target.value === '' ? '' as any : Number(event.target.value));
  };

  const handleGasChange = (gas: Gas, value: number): void => {
    switch (gas) {
      case Gas.O2: onGasChange(value, he, useSetpoint, setpoint); break;
      case Gas.He: onGasChange(o2, value, useSetpoint, setpoint); break;
    }
  }

  const handleBlur = (gas: Gas, ev: any) => {
    const value = ev.target.value;

    if (value < 0) {
      handleGasChange(gas, 0);
    } else if (value > 100) {
      handleGasChange(gas, 100);
    }

  };

  const toggleSetpoint = () => {
    onGasChange(o2, he, !useSetpoint, setpoint);
  }

  return (
    <Root className={classes.root}>

      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            {headline}
          </Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid item>
              O2:
              </Grid>
            <Grid item xs>
              <Slider
                value={typeof o2 === 'number' ? o2 : 0}
                onChange={handleO2SliderChange}
                aria-labelledby="input-slider"
              />
            </Grid>
            <Grid item>
              <Input
                className={classes.input}
                value={o2}
                margin="dense"
                onChange={(ev) => handleGasInputChange(Gas.O2, ev)}
                onBlur={(ev) => handleBlur(Gas.O2, ev)}
                inputProps={{
                  min: 0,
                  max: 100,
                  type: 'number'
                }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} alignItems="center">
            <Grid item>
              HE
            </Grid>
            <Grid item xs>
              <Slider
                value={he}
                onChange={handleHeSliderChange}
                aria-labelledby="input-slider"
              />
            </Grid>
            <Grid item>
              <Input
                className={classes.input}
                value={he}
                margin="dense"
                onChange={(event) => handleGasInputChange(Gas.He, event)}
                onBlur={(event) => handleBlur(Gas.He, event)}
                inputProps={{
                  min: 0,
                  max: 100,
                  type: 'number'
                }}
              />
            </Grid>
          </Grid>

            N2: {100 - o2 - he > 0 ? 100 - o2 - he : 0} <br></br>

          <FormControlLabel
            control={
              <Switch
                checked={useSetpoint}
                onChange={toggleSetpoint}
                name="checkedB"
                color="primary"
              />
            }
            label={'Use Setpoint: ' + setpoint}
          />

        { o2 + he > 100 
          ?
            <div style={{color: "red"}}><strong>INVALID GAS</strong></div>
          : null
        }

        </CardContent>
      </Card>

    </Root>

  );
}

export default GasSelector;
