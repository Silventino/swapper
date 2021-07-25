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
          <Typography variant={"h3"} >New User</Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField placeholder={"Username"} />
        </Grid>
        <Grid item xs={12}>
          <TextField placeholder={"Password"} type={"password"} />
        </Grid>
        <Grid item xs={12}>
          <TextField placeholder={"Confirm Password"} type={"password"} />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={()=>console.log("ok")}>
            Sign In
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default Login;
