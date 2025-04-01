import { AppBar, Toolbar, Typography, Container } from "@mui/material";
import ThemeRegistry from "./ThemeRegistry";
import { TodoList } from "@/components/TodoList";

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
      <Container component="main" sx={{ mt: 3 }} maxWidth="sm">
        <Typography variant="h5" component="h2" gutterBottom>
          What are the top things you want to accomplish today?
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
          (e.g. go for a 20 minute run, mow the lawn, prepare for meeting with
          Jessica at work, help daughter with science project)
        </Typography>
        <TodoList />
      </Container>
    </ThemeRegistry>
  );
}
