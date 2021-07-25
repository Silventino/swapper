import "reflect-metadata";
import React from "react";
import logo from "../logo.svg";
import "../App.css";
import {Button, Grid, TextField, Typography} from "@material-ui/core";

function Login() {
  return (
    <div className="LoginDiv">
      <Grid container spacing={4} >
        <Grid item xs={12}>
          <img src={logo} className="App-logo" alt="logo" />
        </Grid>
        <Grid item xs={12}>
          <TextField placeholder={"User"} />
        </Grid>
        <Grid item xs={12}>
          <TextField placeholder={"Password"} type={"password"} />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary">
            Login
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button color="primary">
            Already have an account? Sign in.
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default Login;
