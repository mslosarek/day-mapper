import {
  Stack,
  Button,
  Typography,
  Divider,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import PetsIcon from "@mui/icons-material/Pets";
import LocalPostOfficeIcon from "@mui/icons-material/LocalPostOffice";
import WorkIcon from "@mui/icons-material/Work";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SchoolIcon from "@mui/icons-material/School";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import * as MuiIcons from "@mui/icons-material";

type ScheduleItem = {
  time: string;
  task: string;
  duration_minutes: number;
  reasoning: string;
  visual_element: string;
  category: string;
};

type ScheduleResponse = {
  success: boolean;
  message: string;
  schedule: {
    summary: string;
    plan: ScheduleItem[];
  };
};

type DailyPlanProps = {
  scheduleData: ScheduleResponse;
  onBack: () => void;
};

type IconModule = {
  [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export function DailyPlan({ scheduleData, onBack }: DailyPlanProps) {
  const IconMap: Record<string, React.ElementType> = {
    DirectionsRun: DirectionsRunIcon,
    Pets: PetsIcon,
    LocalPostOffice: LocalPostOfficeIcon,
    Work: WorkIcon,
    ShoppingCart: ShoppingCartIcon,
    School: SchoolIcon,
    FitnessCenter: FitnessCenterIcon,
  };

  const getIconForVisualElement = (visualElement: string) => {
    // Try to get from our map first
    if (IconMap[visualElement]) {
      const Icon = IconMap[visualElement];
      return <Icon />;
    }

    // Try to get dynamically from MUI icons
    if ((MuiIcons as IconModule)[`${visualElement}Icon`]) {
      const DynamicIcon = (MuiIcons as IconModule)[`${visualElement}Icon`];
      return <DynamicIcon />;
    }

    // Fallback
    return <MiscellaneousServicesIcon />;
  };

  return (
    <Stack spacing={3} sx={{ maxWidth: 600, margin: "auto", p: 2, mt: 4 }}>
      <Divider sx={{ mb: 2 }} />

      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h5">Your Daily Plan</Typography>

        <Button variant="outlined" onClick={onBack} size="small">
          Clear Plan
        </Button>
      </Stack>

      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {scheduleData.schedule.summary}
      </Typography>

      <Divider />

      {scheduleData.schedule.plan.map((item, index) => (
        <Card key={index} variant="outlined">
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  bgcolor: "primary.light",
                  color: "primary.contrastText",
                  minWidth: 48,
                  minHeight: 48,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 24,
                    height: 24,
                  }}
                >
                  {getIconForVisualElement(item.visual_element)}
                </Box>
              </Box>
              <Stack sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" component="div">
                  {item.time} - {item.task}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.duration_minutes} minutes | {item.category}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {item.reasoning}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
