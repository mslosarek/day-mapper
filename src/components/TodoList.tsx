"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, IconButton, Stack, TextField, FormHelperText } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const todoSchema = z.object({
  items: z.array(
    z.object({
      text: z.string().min(1, "Item cannot be empty"),
    })
  ),
});

type TodoForm = z.infer<typeof todoSchema>;

export function TodoList() {
  const { control, handleSubmit, register, formState: { errors } } = useForm<TodoForm>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      items: [{ text: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const onSubmit = (data: TodoForm) => {
    console.log(data);
  };

  return (
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
              />
              <IconButton
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
            {errors.items?.[index]?.text && (
              <FormHelperText error>{errors.items[index].text?.message}</FormHelperText>
            )}
          </Stack>
        ))}
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={() => append({ text: "" })}
            type="button"
          >
            Add Item
          </Button>
          <Button variant="contained" type="submit">
            Generate Daily Plan
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
