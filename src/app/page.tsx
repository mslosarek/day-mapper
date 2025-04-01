import { AppBar, Toolbar, Typography, Container } from '@mui/material';
import ThemeRegistry from './ThemeRegistry';

export default function Home() {
  return (
    <ThemeRegistry>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="h1">
            DayMapper
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 3 }}>
      </Container>
    </ThemeRegistry>
  );
}
