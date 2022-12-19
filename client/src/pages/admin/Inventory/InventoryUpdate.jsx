import { useParams } from "react-router-dom";
import React from "react";
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
  Checkbox,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { tokens } from "../../../themes";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import LoadingDialogue from "../../../global/LoadingDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import SuccessDialogue from "../../../global/SuccessDialogue";
import ConfirmDialogue from "../../../global/ConfirmDialogue";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import { useInventoriesContext } from "../../../hooks/useInventoriesContext";

const InventoryUpdate = () => {
  const { _id } = useParams();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { inventory, inventoryDispatch } = useInventoriesContext();
  const [productDetails, setProductDetails] = useState([]);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [supplier, setSupplier] = useState("");
  const [supplierList, setSupplierList] = useState([]);
  const [expiredOn, setExpiredOn] = useState(null);
  const [productNameError, setProductNameError] = useState(false);
  const [necessity, setNecessity] = useState(false);

  const [isFood, setIsFood] = useState(false);
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
  const toggleIsFood = () => {
    setIsFood((prev) => !prev);
  };
  const toggleIsNecessity = () => {
    setNecessity((prev) => !prev);
  };
  const clearFields = () => {
    setProductName("");
    setPrice("");
    setQuantity("");
    setBrand("");
    setCategory("");
    setNewCategory("");
    setSupplier("");
    setExpiredOn(null);
    setIsFood(false);
    setNecessity(false);
  };
  useEffect(() => {
    const getData = async () => {
      try {
        let allCategory = [];
        let filteredCategory = [];
        setLoadingDialog({ isOpen: true });
        const response = await axiosPrivate.get("/api/inventory/allProducts");
        if (response.status === 200) {
          const json = await response.data;
          json &&
            json.map((val) => {
              return allCategory.push(val.category);
            });
          inventoryDispatch({ type: "SET_INVENTORIES", payload: json });
        }
        filteredCategory = [...new Set(allCategory)];

        setCategoryList([...filteredCategory]);

        const getItemData = await axiosPrivate.get(`/api/inventory/${_id}`);
        if (getItemData.status === 200) {
          const json = await response.data;
          setProductDetails(json[0]);
        }
        setLoadingDialog({ isOpen: false });
      } catch (error) {
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

  useEffect(() => {
    setProductName(productDetails?.productName);
    setPrice(productDetails?.price);
    setQuantity(productDetails?.quantity);
    setBrand(productDetails?.brand);
    setCategory(productDetails?.category);
    setSupplier(productDetails?.supplier);
    setExpiredOn(productDetails?.expiredOn);
    setIsFood(productDetails?.expiredOn ? false : true);
    setNecessity(productDetails?.necessity);
  }, [productDetails]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    let expiredOnTemp, finalCategory;
    try {
      setLoadingDialog({ isOpen: true });

      isFood ? (expiredOnTemp = "n/a") : (expiredOnTemp = expiredOn);
      category === "newCategory"
        ? (finalCategory = newCategory)
        : (finalCategory = category);
      const product = {
        productName,
        price,
        quantity,
        brand,
        category: finalCategory,
        supplier,
        expiredOn: expiredOnTemp,
        necessity,
      };
      const sendData = await axiosPrivate.patch(
        `/api/inventory/update/${_id}`,
        JSON.stringify(product)
      );
      if (sendData.status === 200) {
        const json = await sendData.data;
        setSuccessDialog({
          isOpen: true,
          message: `Product [${json.productName}]  has been updated!`,
        });
        setLoadingDialog({ isOpen: false });
        clearFields();
      }
    } catch (error) {
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
            Edit product details
          </Typography>
        </Box>
        <Divider sx={{ m: "1em 0" }} />
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
              Product Information
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
                label="Product Name"
                variant="outlined"
                placeholder=""
                autoComplete="off"
                error={productNameError}
                value={productName}
                onChange={(e) => {
                  setProductName(e.target.value);
                }}
              />
              <TextField
                required
                type="number"
                label="Price"
                variant="outlined"
                placeholder=""
                autoComplete="off"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
              />
              <TextField
                required
                type="number"
                label="Quantity"
                variant="outlined"
                placeholder=""
                autoComplete="off"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                }}
              />
              <TextField
                required
                label="Brand"
                variant="outlined"
                placeholder=""
                autoComplete="off"
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                }}
              />
              {category === "newCategory" ? (
                <TextField
                  required
                  label="New Category"
                  variant="outlined"
                  placeholder=""
                  autoComplete="off"
                  value={newCategory}
                  onChange={(e) => {
                    setNewCategory(e.target.value);
                  }}
                />
              ) : (
                <FormControl required>
                  <InputLabel id="demo-simple-select-required-label">
                    Category
                  </InputLabel>
                  <Select
                    required
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={category}
                    label="Category"
                    onChange={(e) => {
                      setCategory(e.target.value);
                    }}
                  >
                    {categoryList &&
                      categoryList.map((value) => {
                        return (
                          <MenuItem key={value} value={value}>
                            {value}
                          </MenuItem>
                        );
                      })}
                    <MenuItem value={"newCategory"}>New Category</MenuItem>
                  </Select>
                </FormControl>
              )}
              <TextField
                required
                label="Supplier"
                variant="outlined"
                placeholder=""
                autoComplete="off"
                value={supplier}
                onChange={(e) => {
                  setSupplier(e.target.value);
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                }}
              >
                {!isFood ? (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DesktopDatePicker
                      label="Expired on"
                      inputFormat="MM/dd/yyyy"
                      value={expiredOn}
                      onChange={setExpiredOn}
                      renderInput={(params) => (
                        <TextField
                          autoComplete="off"
                          error={false}
                          required
                          disabled
                          fullWidth
                          {...params}
                        />
                      )}
                    />
                  </LocalizationProvider>
                ) : (
                  <></>
                )}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    height: "4em",
                    width: "100%",
                  }}
                >
                  <Checkbox
                    checked={isFood}
                    onChange={toggleIsFood}
                    sx={{ height: "5px", width: "5px", mr: 1 }}
                    color="primary"
                  />

                  <Typography variant="h5">No expiration</Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  height: "4em",
                  width: "100%",
                }}
              >
                <Checkbox
                  checked={necessity}
                  onChange={toggleIsNecessity}
                  sx={{ height: "5px", width: "5px", mr: 1 }}
                  color="primary"
                />

                <Typography variant="h5">
                  Necessity (Discountable for Senior Citizen or PWDs)
                </Typography>
              </Box>
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
                disabled={productNameError}
              >
                <Typography variant="h4">Submit</Typography>
              </Button>
              <Button
                type="button"
                variant="contained"
                color="secondary"
                onClick={(e) => {
                  clearFields();
                }}
              >
                <Typography variant="h4">Cancel</Typography>
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};

export default InventoryUpdate;
