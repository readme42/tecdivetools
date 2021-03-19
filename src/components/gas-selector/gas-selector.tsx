import React, { FC, InputHTMLAttributes } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

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

const useStyles = makeStyles({
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  input: {
    width: 42,
  },
});

const GasSelector: FC<InputProps> = ({ headline, o2, he, useSetpoint, setpoint, onGasChange, ...rest }) => {

  const classes = useStyles();

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
    <div className="App">

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

    </div>

  );
}

export default GasSelector;
