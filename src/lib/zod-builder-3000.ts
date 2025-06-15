import { z } from "zod";
import type { Field } from "@/stores/scenario-store";

export function buildFieldSchema(field: Field) {
  switch (field.type) {
    case "text": {
      let schema = z.string();
      if (field.isRequired) {
        schema = schema.min(1, { message: `${field.label} is required` });
      }
      return schema;
    }

    case "number": {
      let schema = z.coerce.number({
        invalid_type_error: `${field.label} must be a number`,
        required_error: `${field.label} is required`,
      });
      if (typeof field.min === "number") {
        schema = schema.min(field.min, {
          message: `Minimum value is ${field.min}`,
        });
      }
      if (typeof field.max === "number") {
        schema = schema.max(field.max, {
          message: `Maximum value is ${field.max}`,
        });
      }
      return schema;
    }

    case "doubleNumber":
      return z.object({
        from: z.number({ invalid_type_error: "Must be a number" }),
        to: z.number({ invalid_type_error: "Must be a number" }),
      });

    case "boolean":
      return z.boolean();

    case "dropdown":
    case "searchdropdown":
      return z
        .string()
        .min(field.isRequired ? 1 : 0, {
          message: `${field.label} is required`,
        })
        .refine(
          (val) =>
            !field.isRequired ||
            field.options?.some(
              (o: any) => o === val || o.value === val || o.name === val,
            ),
          {
            message: `${field.label} must be a valid option`,
          },
        );

    case "multiselectsearchdropdown":
    case "badgeselect":
      return z
        .array(z.string())
        .refine(
          (vals) =>
            !field.isRequired ||
            (Array.isArray(vals) &&
              vals.length > 0 &&
              vals.every((val) =>
                field.options?.some(
                  (o: any) =>
                    o.name === val || o.label === val || o.number === val,
                ),
              )),
          { message: `${field.label} must have at least one valid selection` },
        );

    case "date":
    case "datetime":
    case "dateTimeDuration":
      return field.isRequired
        ? z.date({ invalid_type_error: `${field.label} must be a valid date` })
        : z.date().nullable();

    case "dateTimeRange":
      return z.object({
        from: z.date().nullable(),
        to: z.date().nullable(),
      });

    case "numDateSelect":
      return z.object({
        number: z.number({
          invalid_type_error: `${field.label} number must be a number`,
          required_error: `${field.label} number is required`,
        }),
        dateRange: z.object({
          from: z.date({
            invalid_type_error: `${field.label} from date is invalid`,
          }),
          to: z.date({
            invalid_type_error: `${field.label} to date is invalid`,
          }),
        }),
        category: z
          .string()
          .min(1, { message: `${field.label} category is required` }),
      });

    case "numberDateTimeRange":
      return z.object({
        number: z.number({
          invalid_type_error: `${field.label} number must be a number`,
          required_error: `${field.label} number is required`,
        }),
        dateTimeRange: z.object({
          from: z.date().nullable(),
          to: z.date().nullable(),
        }),
      });

    case "doubleNumberDateRange":
      return z.object({
        firstNumber: z.number({
          invalid_type_error: `${field.label} first number must be a number`,
          required_error: `${field.label} first number is required`,
        }),
        secondNumber: z.number({
          invalid_type_error: `${field.label} second number must be a number`,
          required_error: `${field.label} second number is required`,
        }),
        dateRange: z.object({
          from: z.date().nullable(),
          to: z.date().nullable(),
        }),
      });

    default:
      return z.any();
  }
}

export function buildSchema(fields: Field[]) {
  const shape = fields.reduce(
    (acc, field) => {
      acc[field.name] = buildFieldSchema(field);
      return acc;
    },
    {} as Record<string, z.ZodTypeAny>,
  );
  return z.object(shape);
}

export function getDefaultValues(fields: Field[]) {
  const defaults: Record<string, any> = {};

  //console.log("XXXXDefaults for: ", fields);
  for (const field of fields) {
    switch (field.type) {
      case "dateTimeRange":
        defaults[field.name] = {
          from: field.val?.from ? new Date(field.val.from) : null,
          to: field.val?.to ? new Date(field.val.to) : null,
        };
        break;

      case "numDateSelect":
        defaults[field.name] = {
          number: field.val?.number ?? 0,
          dateRange: {
            from: field.val?.dateRange?.from
              ? new Date(field.val.dateRange.from)
              : new Date(),
            to: field.val?.dateRange?.to
              ? new Date(field.val.dateRange.to)
              : new Date(),
          },
          category: field.val?.category ?? "",
        };
        break;

      case "doubleNumber":
        defaults[field.name] = {
          from: field.val?.from ?? 0,
          to: field.val?.to ?? 0,
        };
        break;

      case "dateTimeDuration":
        defaults[field.name] = field.val ?? null;
        break;

      case "boolean":
        defaults[field.name] = field.val ?? false;
        break;

      case "text":
        defaults[field.name] = field.val ?? "";
        break;

      case "number":
        defaults[field.name] = field.val ?? 0;
        break;

      case "dropdown":
      case "searchdropdown":
        defaults[field.name] = field.val ?? "";
        break;

      case "multiselectsearchdropdown":
      case "badgeselect":
        defaults[field.name] = field.val ?? [];
        break;

      case "date":
      case "datetime":
        defaults[field.name] = field.val ? new Date(field.val) : null;
        break;

      case "numberDateTimeRange":
        defaults[field.name] = {
          number: field.val?.number ?? 0,
          dateTimeRange: {
            from: field.val?.dateTimeRange?.from ?? null,
            to: field.val?.dateTimeRange?.to ?? null,
          },
        };
        break;

      case "doubleNumberDateRange":
        defaults[field.name] = {
          firstNumber: field.val?.firstNumber ?? 0,
          secondNumber: field.val?.secondNumber ?? 0,
          dateRange: {
            from: field.val?.dateRange?.from ?? null,
            to: field.val?.dateRange?.to ?? null,
          },
        };
        break;

      default:
        defaults[field.name] = field.val ?? null;
        break;
    }
    //console.log(
      "XXXXfieldname: ",
      field.name,
      ". defaults set: ",
      defaults,
      ". field state: ",
      field,
    );
  }

  return defaults;
}
