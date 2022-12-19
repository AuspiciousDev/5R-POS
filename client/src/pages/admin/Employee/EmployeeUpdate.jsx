import {
  Box,
  Paper,
  Typography,
  Button,
  useTheme,
  TextField,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import { tokens } from "../../../themes";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import LoadingDialogue from "../../../global/LoadingDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import SuccessDialogue from "../../../global/SuccessDialogue";
import ConfirmDialogue from "../../../global/ConfirmDialogue";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const EmployeeUpdate = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const axiosPrivate = useAxiosPrivate();
  const { username } = useParams();
  const isLetters = (str) => /^[A-Za-z\s]*$/.test(str);
  const isNumber = (str) => /^[0-9]*$/.test(str);
  const [usernameC, setUsernameC] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [birthday, setBirthday] = useState("");

  const [employeeDetails, setEmployeeDetails] = useState([]);
  const [userNameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [mobileError, setMobileError] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [successDialog, setSuccessDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [errorDialog, setErrorDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const [loadingDialog, setLoadingDialog] = useState({
    isOpen: false,
  });
  const clearFields = () => {
    setEmail("");
    setUserType("");
    setMiddleName("");
    setLastName("");
    setAddress("");
    setLastName("");
    [setMobile] = useState("");
    [setBirthday] = useState("");
    setUsernameError(false);
    setEmailError(false);
    setMobileError(false);
  };
  useEffect(() => {
    const getData = async () => {
      try {
        setLoadingDialog({ isOpen: true });

        const getItemData = await axiosPrivate.get(`/api/users/${username}`);
        if (getItemData.status === 200) {
          const json = await getItemData.data;
          console.log(
            "🚀 ~ file: EmployeeUpdate.jsx:80 ~ getData ~ json",
            json
          );
          setEmployeeDetails(json);
        }
        setLoadingDialog({ isOpen: false });
      } catch (error) {
        console.log(
          "🚀 ~ file: EmployeeUpdate.jsx:84 ~ getData ~ error",
          error
        );
        setLoadingDialog({ isOpen: false });
        if (!error?.response) {
          setErrorDialog({
            isOpen: true,
            message: `No server response`,
          });
        } else if (error.response.status === 400) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          console.log(error.response.data.message);
        } else if (error.response.status === 404) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          console.log(error.response.data.message);
        } else if (error.response.status === 500) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          console.log(error.response.data.message);
        } else {
          setErrorDialog({
            isOpen: true,
            message: `${error}`,
          });
          console.log(error);
        }
      }
    };
    getData();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoadingDialog({ isOpen: true });
      const employee = {
        username: username,
        email,
        userType,
        firstName,
        middleName,
        lastName,
        address,
        mobile: "09" + mobile,
        birthday,
      };
      console.log(
        "🚀 ~ file: EmployeeAdd.jsx:68 ~ handleSubmit ~ employee",
        employee
      );

      const sendData = await axiosPrivate.patch(
        `/api/users/update/${username}`,
        JSON.stringify(employee)
      );
      if (sendData.status === 200) {
        const json = await sendData.data;
        setSuccessDialog({
          isOpen: true,
          title: `Employee [${json.username}]  has been updated!!`,
        });
        setLoadingDialog({ isOpen: false });
        clearFields();
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: EmployeeUpdate.jsx:162 ~ handleSubmit ~ error",
        error
      );
      setLoadingDialog({ isOpen: false });
      if (!error?.response) {
        console.log("no server response");
        setErrorDialog({
          isOpen: true,
          message: `${"No server response!"}`,
        });
      } else if (error.response.status === 400) {
        console.log(error.response.data.message);
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
      } else if (error.response.status === 409) {
        console.log(error.response.data.duplicateFields);
        const duplicateFields = error.response.data.duplicateFields;
        console.log(
          "🚀 ~ file: EmployeeAdd.jsx:119 ~ handleSubmit ~ duplicateFields",
          duplicateFields
        );
        if (duplicateFields.includes("username")) {
          setUsernameError(true);
        }
        if (duplicateFields.includes("email")) {
          setEmailError(true);
        }
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
      } else if (error.response.status === 500) {
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
        console.log(error.response.data.message);
      } else {
        console.log(error);
        setErrorDialog({
          isOpen: true,
          message: `${error}`,
        });
      }
    }
  };
  useEffect(() => {
    setEmail(employeeDetails?.email);
    setUserType(employeeDetails?.userType);
    setFirstName(employeeDetails?.firstName);
    setMiddleName(employeeDetails?.middleName);
    setLastName(employeeDetails?.lastName);
    setAddress(employeeDetails?.address);
    setMobile(employeeDetails?.mobile);
    setBirthday(employeeDetails?.birthday);
  }, [employeeDetails]);
  return (
    <Box className="contents">
      <ConfirmDialogue
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
      <SuccessDialogue
        successDialog={successDialog}
        setSuccessDialog={setSuccessDialog}
      />
      <ErrorDialogue
        errorDialog={errorDialog}
        setErrorDialog={setErrorDialog}
      />

      <LoadingDialogue
        loadingDialog={loadingDialog}
        setLoadingDialog={setLoadingDialog}
      />
      <Paper
        className="contents-body"
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box className="contents-header">
          <Typography
            variant="h1"
            textTransform="uppercase"
            sx={{
              paddingLeft: "0.3em",
              borderLeft: `solid 5px ${colors.primary[500]}`,
            }}
            fontWeight="700"
          >
            Edit employee details
          </Typography>
        </Box>
        <Divider sx={{ marginBottom: "1em " }} />
        <Box sx={{ height: "100%" }}>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Typography
              variant="h3"
              sx={{
                paddingLeft: "0.3em",
                borderLeft: `solid 5px ${colors.secondary[500]}`,
                m: "10px 0 10px 0",
              }}
            >
              Employment Information
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
              }}
            >
              <TextField
                required
                disabled
                label="Username"
                variant="outlined"
                placeholder=""
                autoComplete="off"
                error={userNameError}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setUsernameError(false);
                }}
              />
              <TextField
                required
                disabled
                label="Email"
                type="email"
                variant="outlined"
                placeholder=""
                autoComplete="off"
                error={emailError}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(false);
                }}
              />
              <FormControl required>
                <InputLabel id="demo-simple-select-required-label">
                  User type
                </InputLabel>
                <Select
                  required
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={userType}
                  label="User type"
                  onChange={(e) => {
                    setUserType(e.target.value);
                  }}
                >
                  <MenuItem value={"admin"}>Admin</MenuItem>
                  <MenuItem value={"employee"}>Employee</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Typography
              variant="h3"
              sx={{
                paddingLeft: "0.3em",
                borderLeft: `solid 5px ${colors.secondary[500]}`,
                m: "25px 0 10px 0",
              }}
            >
              Personal Information
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
              }}
            >
              <TextField
                required
                label="First Name"
                variant="outlined"
                placeholder=""
                autoComplete="off"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              />
              <TextField
                label="Middle Name"
                variant="outlined"
                placeholder=""
                autoComplete="off"
                value={middleName}
                onChange={(e) => {
                  setMiddleName(e.target.value);
                }}
              />
              <TextField
                required
                label="Last Name"
                variant="outlined"
                placeholder=""
                autoComplete="off"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              />
              <Box></Box>
              <TextField
                required
                label="Address"
                variant="outlined"
                placeholder="House Number, Street Barangay, City, Province"
                autoComplete="off"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              />

              <TextField
                required
                autoComplete="off"
                variant="outlined"
                label="Mobile Number"
                error={mobileError}
                value={mobile}
                placeholder="9 Digit Mobile Number"
                inputProps={{ maxLength: 9 }}
                onChange={(e) => {
                  const value = e.target.value;
                  if (isNumber(value) || "") {
                    setMobileError(false);
                    if (value.length != 9) {
                      setMobileError(true);
                      setMobile(value);
                    }
                    setMobile(value);
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <>
                      <Typography>09</Typography>
                      <Divider
                        sx={{ height: 28, m: 0.5 }}
                        orientation="vertical"
                      />
                    </>
                  ),
                }}
              />

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  label="Birthday"
                  inputFormat="MM/dd/yyyy"
                  value={birthday}
                  onChange={setBirthday}
                  renderInput={(params) => (
                    <TextField
                      autoComplete="off"
                      error={false}
                      required
                      disabled
                      {...params}
                    />
                  )}
                />
              </LocalizationProvider>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "end",
                gap: 2,
                mt: 2,
                "& > button": {
                  width: "20em",
                  height: "4em",
                },
              }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={userNameError || emailError || mobileError}
              >
                <Typography variant="h4">Submit</Typography>
              </Button>
              <Button type="button" variant="contained" color="secondary">
                <Typography variant="h4">Cancel</Typography>
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};

export default EmployeeUpdate;
