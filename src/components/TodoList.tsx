"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import {
  Button,
  IconButton,
  Stack,
  TextField,
  FormHelperText,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DailyPlan } from "./DailyPlan";

const todoSchema = z.object({
  items: z.array(
    z.object({
      text: z.string().min(1, "Item cannot be empty"),
    }),
  ),
});

type TodoForm = z.infer<typeof todoSchema>;

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

export function TodoList() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scheduleData, setScheduleData] = useState<ScheduleResponse | null>(
    null,
  );
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<TodoForm>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      items: [{ text: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const onSubmit = async (data: TodoForm) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const result = await response.json();
      console.log("Server response:", result);
      setScheduleData(result);
    } catch (error) {
      console.error("Error submitting todo items:", error);
      setError(
        error instanceof Error ? error.message : "Failed to submit todo items",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} sx={{ maxWidth: 600, margin: "auto", p: 2 }}>
          {fields.map((field, index) => (
            <Stack key={field.id} spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                  fullWidth
                  {...register(`items.${index}.text`)}
                  placeholder="Enter item"
                  error={!!errors.items?.[index]?.text}
                  helperText={null}
                  disabled={isLoading}
                />
                <IconButton
                  onClick={() => remove(index)}
                  disabled={fields.length === 1 || isLoading}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
              {errors.items?.[index]?.text && (
                <FormHelperText error>
                  {errors.items[index].text?.message}
                </FormHelperText>
              )}
            </Stack>
          ))}
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={() => append({ text: "" })}
              type="button"
              disabled={isLoading}
            >
              Add Item
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={isLoading}
              startIcon={
                isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {isLoading ? "Processing..." : "Generate Daily Plan"}
            </Button>
          </Stack>
        </Stack>
      </form>

      {scheduleData && (
        <DailyPlan
          scheduleData={scheduleData}
          onBack={() => setScheduleData(null)}
        />
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setError(null)} severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}
