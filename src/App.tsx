import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import GasSelector from './components/gas-selector/gas-selector';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

function App() {

  const [valueFromO2, setValueFromO2] = React.useState(15);
  const [valueFromHe, setValueFromHe] = React.useState(45);
  const [setpointFrom, setSetpointFrom] = React.useState(1.3);
  const [useSetpointFrom, setUseSetpointFrom] = React.useState(true);

  const [valueToO2, setValueToO2] = React.useState(50);
  const [valueToHe, setValueToHe] = React.useState(0);
  const [setpointTo, setSetpointTo] = React.useState(1.3);
  const [useSetpointTo, setUseSetpointTo] = React.useState(false);

  const DENSITY_O2 = 1.428;
  const DENSITY_HE = 0.179;
  const DENSITY_N2 = 1.251;

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
    const heDrop = Math.round(ppHeFrom(depth) / depth * 100) - Math.round(ppHeTo(depth) / depth * 100);

    const o2From = ppO2From(depth) / depth * 100;
    const heFrom = ppHeFrom(depth) / depth * 100;
    const n2From = 100 - o2From - heFrom;

    const o2To = ppO2To(depth) / depth * 100
    const heTo = ppHeTo(depth) / depth * 100
    const n2To = 100 - o2To - heTo;

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

      resultingGasFrom: Math.round(o2From) + '/' + Math.round(heFrom),
      resultingGasTo: Math.round(o2To) + '/' + Math.round(heTo),

      resultingGasFromDensity: roundWithTwoDecimals(
       DENSITY_O2 * ppO2From(depth) +
          DENSITY_HE * ppHeFrom(depth) +
          DENSITY_N2 * ppN2From(depth)
      ),

      resultingGasToDensity: roundWithTwoDecimals(
          DENSITY_O2 * ppO2To(depth) +
          DENSITY_HE * ppHeTo(depth) +
          DENSITY_N2 * ppN2To(depth)
      ),

      N2Incr: n2Incr,
      HeDrop: heDrop,
      N2IncrMax:  heDrop / 5
    }
  });


  return (
    <div>
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
                <TableCell align="right"></TableCell>
                <TableCell align="right">ppO2<br></br>[bar]</TableCell>
                <TableCell align="right">ppN2<br></br>[bar]</TableCell>
                <TableCell align="right">ppHe<br></br>[bar]</TableCell>
                <TableCell align="right">O2/He</TableCell>
                <TableCell align="right">Density</TableCell>
                <TableCell align="left">IANTD 5% rule</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.depth}>

                  { /* Depth */ }
                  <TableCell component="th" scope="row">
                    {row.depth}
                  </TableCell>

                  <TableCell component="th" scope="row">
                    from<br></br>
                    to<br></br>
                    diff
                  </TableCell>

                  { /* ppO2 */ }
                  <TableCell align="right" >
                    {row.ppO2From.toFixed(2)}<br></br>
                    {row.ppO2To.toFixed(2)}<br></br>
                    <b>{Math.abs(row.diffO2).toFixed(2)}</b>
                  </TableCell>

                  { /* ppN2 */ }
                  <TableCell align="right" style={{ color: getColor(row.diffN2.toFixed(2)) }}>
                    {row.ppN2From.toFixed(2)}<br></br>
                    {row.ppN2To.toFixed(2)}<br></br><b>
                    {Math.abs(row.diffN2).toFixed(2)}</b>
                  </TableCell>

                  { /* ppHe */ }
                  <TableCell align="right" style={{ color: getColor(row.diffHe.toFixed(2)) }}>
                    {row.ppHeFrom.toFixed(2)}<br></br>
                    {row.ppHeTo.toFixed(2)}<br></br>
                    <b>{Math.abs(row.diffHe).toFixed(2)}</b>
                  </TableCell>

                  { /* Gas */ }
                  <TableCell align="right">
                    {row.resultingGasFrom}<br></br>
                    {row.resultingGasTo}<br></br>&nbsp;
                  </TableCell>

                  { /* Density */ }
                  <TableCell align="right">
                    <span style={{ color: row.resultingGasFromDensity > 6 ? 'red' : '' }}>
                      {row.resultingGasFromDensity}
                    </span><br></br>

                    <span style={{ color: row.resultingGasToDensity > 6 ? 'red' : '' }}>
                      {row.resultingGasToDensity}
                    </span><br></br>&nbsp;
                  </TableCell>

                  { /* IANTD 5% */}
                  <TableCell align="left"
                             style={{ color: row.N2Incr < row.N2IncrMax ? 'green' : 'red' }}>
                    {row.N2Incr}%&nbsp;N2&nbsp;incr<br></br>
                    {row.HeDrop}%&nbsp;He&nbsp;drop<br></br>
                    {row.N2IncrMax}%&nbsp;N2&nbsp;incr&nbsp;max<br></br>
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
              IANTD 5% rule aka IANTD rule of fifth
          </Typography>
            <cite>
              The 5:1 ratio indicates that a diver should not switch to a gas that has a helium drop of
              5% (actual percent by volume) for every 1%(actual percent by volume) increase in nitrogen content.
            </cite> <br></br>
          [Tom Mount, Joseph Dituri:  Exploration and Mixed Gas Diving Encyclopedia (The Tao of Survival Underwater)]

            <br></br>
            <br></br>
            <strong>This can be rephrased into: "Limit your rise in N2 to one fifth of the drop in Helium as you ascend."</strong>
          </CardContent>
        </Card>

        <br></br>

      </Container>
      <Container maxWidth="md">
        <footer>

          <p>
            This calculation might be incorrect and / or contain bugs. Taking this calculations for real might kill you. <br></br>
            Do not rely on this tool for your dive planning. <br></br>
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
