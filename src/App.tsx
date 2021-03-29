import React from 'react';
import { makeStyles, StylesProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import GasSelector from './components/gas-selector/gas-selector';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  }
});

function App() {

  const classes = useStyles();

  const [valueFromO2, setValueFromO2] = React.useState(15);
  const [valueFromHe, setValueFromHe] = React.useState(45);
  const [setpointFrom, setSetpointFrom] = React.useState(1.3);
  const [useSetpointFrom, setUseSetpointFrom] = React.useState(true);

  const [valueToO2, setValueToO2] = React.useState(50);
  const [valueToHe, setValueToHe] = React.useState(0);
  const [setpointTo, setSetpointTo] = React.useState(1.3);
  const [useSetpointTo, setUseSetpointTo] = React.useState(false);

  function handleFromGasChange(o2: number, he: number, useSetpoint: boolean, setpoint?: number): void {
    setValueFromO2(o2);
    setValueFromHe(he);
    setUseSetpointFrom(useSetpoint);
    if (setpoint) {
      setSetpointFrom(setpoint)
    }
  }

  function handleToGasChange(o2: number, he: number, useSetpoint: boolean, setpoint?: number): void {
    setValueToO2(o2);
    setValueToHe(he);
    setUseSetpointTo(useSetpoint);
    if (setpoint) {
      setSetpointTo(setpoint)
    }
  }

  function ppO2From(pressure: number, ignoreSetpoint = false): number {
    return useSetpointFrom && !ignoreSetpoint
      ? setpointFrom
      : roundWithTwoDecimals(valueFromO2 / 100 * pressure);
  }
  function ppO2To(pressure: number, ignoreSetpoint = false): number {
    return useSetpointTo && !ignoreSetpoint
      ? setpointTo
      : roundWithTwoDecimals(valueToO2 / 100 * pressure);
  }

  function ppN2From(pressure: number, ignoreSetpoint = false): number {
    const factor = useSetpointFrom && !ignoreSetpoint
      ? getFromGasFactor(pressure, setpointFrom)
      : 1;

    return roundWithTwoDecimals(((100 - valueFromO2 - valueFromHe) / 100 * pressure) * factor);
  }

  function ppN2To(pressure: number, ignoreSetpoint = false): number {
    const factor = useSetpointTo && !ignoreSetpoint
      ? getToGasFactor(pressure, setpointTo)
      : 1;

    return roundWithTwoDecimals(((100 - valueToO2 - valueToHe) / 100 * pressure) * factor);
  }

  function ppHeFrom(pressure: number, ignoreSetpoint = false): number {
    const factor = useSetpointFrom && !ignoreSetpoint
      ? getFromGasFactor(pressure, setpointFrom)
      : 1;

    return roundWithTwoDecimals((valueFromHe / 100 * pressure) * factor);
  }
  function ppHeTo(pressure: number, ignoreSetpoint = false): number {
    const factor = useSetpointTo && !ignoreSetpoint
      ? getToGasFactor(pressure, setpointTo)
      : 1;

    // console.log('ppHeTo', factor)
    return roundWithTwoDecimals((valueToHe / 100 * pressure) * factor);

  }

  function getFromGasFactor(pressure: number, setpoint: number): number {
    return (pressure - setpoint) / (ppN2From(pressure, true) + ppHeFrom(pressure, true))
  }
  function getToGasFactor(pressure: number, setpoint: number): number {
    return (pressure - setpoint) / (ppN2To(pressure, true) + ppHeTo(pressure, true))
  }

  function diffPpO2(pressure: number) {
    return roundWithTwoDecimals(ppO2From(pressure) - ppO2To(pressure));
  }
  function diffPpN2(pressure: number) {
    return roundWithTwoDecimals(ppN2From(pressure) - ppN2To(pressure));
  }
  function diffPpHe(pressure: number) {
    return roundWithTwoDecimals(ppHeFrom(pressure) - ppHeTo(pressure));
  }

  const roundWithTwoDecimals = (x: number) => Math.round(x * 100) / 100;

  const getColor = (value: string) => {
    const numbr: number = parseFloat(value);

    return Math.abs(numbr) >= 0.5
      ? (Math.abs(numbr) >= 1.0
        ? 'red'
        : 'orange')
      : 'green';
  }

  const rows = [1.6, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(depth => {

    const n2Incr = Math.round(((100 - ppO2To(depth) / depth * 100) - (ppHeTo(depth) / depth * 100)) - ((100 - ppO2From(depth) / depth * 100) - (ppHeFrom(depth) / depth * 100)))

    return {

      depth: Math.round((depth - 1) * 10),
      ppO2From: ppO2From(depth),
      ppO2To: ppO2To(depth),
      diffO2: diffPpO2(depth),

      diffN2: diffPpN2(depth),
      ppN2From: ppN2From(depth),
      ppN2To: ppN2To(depth),


      diffHe: diffPpHe(depth),
      ppHeFrom: ppHeFrom(depth),
      ppHeTo: ppHeTo(depth),

      resultingGasFrom: Math.round(ppO2From(depth) / depth * 100) + '/' + Math.round(ppHeFrom(depth) / depth * 100),
      resultingGasTo: Math.round(ppO2To(depth) / depth * 100) + '/' + Math.round(ppHeTo(depth) / depth * 100),

      N2Incr: n2Incr,
      HeDrop: Math.round(ppHeFrom(depth) / depth * 100) - Math.round(ppHeTo(depth) / depth * 100),
      HeDropMax: n2Incr * 5
    }
  });


  return (
    <div className="App">
      <header className="App-header">
        <Container maxWidth="md">
          <h1>TecDiveTools</h1>

          Gas Switch Calculator: Calculate the partial pressure differences between two gases for different ambient pressures
          <br></br>
          <br></br>
        </Container>
      </header>

      <CssBaseline />
      <Container maxWidth="md">

        <GasSelector
          o2={valueFromO2}
          he={valueFromHe}
          headline={'From Gas'}
          useSetpoint={useSetpointFrom}
          setpoint={setpointFrom}
          onGasChange={handleFromGasChange}>
        </GasSelector>

        <br></br>

        <GasSelector
          o2={valueToO2}
          he={valueToHe}
          headline={'To Gas'}
          useSetpoint={useSetpointTo}
          setpoint={setpointTo}
          onGasChange={handleToGasChange}  >
        </GasSelector>
        <br></br>

        <TableContainer component={Paper}>
          <Table
            style={{ minWidth: 500 }}
            size="small"
            aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Depth<br></br> [m]</TableCell>
                <TableCell align="right">ppO2</TableCell>
                <TableCell align="right">ppN2</TableCell>
                <TableCell align="right">ppHe</TableCell>
                <TableCell align="right">Gas</TableCell>
                <TableCell align="left">IANTD 5% rule</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.depth}>
                  <TableCell component="th" scope="row">
                    {row.depth}
                  </TableCell>
                  <TableCell align="right" >from: {row.ppO2From.toFixed(2)} <br></br>to: {row.ppO2To.toFixed(2)} <br></br><b>diff: {Math.abs(row.diffO2).toFixed(2)}</b></TableCell>

                  <TableCell align="right" style={{ color: getColor(row.diffN2.toFixed(2)) }}>from: {row.ppN2From.toFixed(2)} <br></br>to: {row.ppN2To.toFixed(2)} <br></br><b>diff: {Math.abs(row.diffN2).toFixed(2)}</b></TableCell>

                  <TableCell align="right" style={{ color: getColor(row.diffHe.toFixed(2)) }}>from: {row.ppHeFrom.toFixed(2)} <br></br>to: {row.ppHeTo.toFixed(2)} <br></br><b>diff: {Math.abs(row.diffHe).toFixed(2)}</b></TableCell>

                  <TableCell align="right">
                    from: {row.resultingGasFrom}<br></br>
                    to: {row.resultingGasTo}<br></br>
                  </TableCell>

                  <TableCell align="left"
                    style={{ color: row.HeDrop < row.HeDropMax ? 'green' : 'red' }}>
                    {row.N2Incr}% N2 increase<br></br>
                    {row.HeDropMax}% max He drop: <br></br>
                    {row.HeDrop}% He drop:
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <br></br>
        Color visualization is for partial pressure difference only. <br></br>
            Green: Partial pressure difference is below 0.5 <br></br>
            Orange: Partial pressure difference is between 0.5 and 1.0 <br></br>
            Red: Partial pressure difference is above 1.0 <br></br>
        <br></br>

        <Card>
          <CardContent>
            <Typography variant="h5" component="h2">
              IANTD 5% rule
          </Typography>
            <cite>
              The 5:1 ratio indicates that a diver should not switch to a gas that has a helium drop of
              5% (actual percent by volume) for every 1%(actual percent by volume) increase in nitrogen content.
          </cite> <br></br>
          [Tom Mount, Joseph Dituri:  Exploration and Mixed Gas Diving Encyclopedia (The Tao of Survival Underwater)]
          </CardContent>
        </Card>

        <br></br>

      </Container>
      <Container maxWidth="md">
        <footer>

          <p>
            This calculation might be incorrect and / or contain bugs.
            Do not rely on this tool for your dive planning.
            Do your own calculations.
          </p>

          <p>
            You are most welcome to check the <a href="https://github.com/readme42/tecdivetool">source code on GitHub</a> and report bugs if you find some.
          </p>

        </footer>
      </Container>


    </div>
  );
}

export default App;
