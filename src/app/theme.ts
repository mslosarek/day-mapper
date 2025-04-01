import { createTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: grey[900],
      light: grey[800],
      dark: grey[900],
    },
    background: {
      default: grey[400],
      paper: grey[300],
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: grey[900],
          color: grey[50],
        },
      },
    },
  },
});
