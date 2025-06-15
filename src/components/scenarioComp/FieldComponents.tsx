import { Switch } from "@/components/ui/switch";

import {
  ScenarioStore,
  type BadgeSelectType,
  type BaseField,
  type BooleanField,
  type DateField,
  type DateTime,
  type DateTimeDuration,
  type DateTimeRangeField,
  type DoubleNumberDateRangeField,
  type DoubleNumberField,
  type DropdownField,
  type MultiSelectSearchDropdownField,
  type NumberDateTimeRangeField,
  type NumberField,
  type NumDateSelectField,
  type TextField,
  type TransactionMedium,
} from "@/stores/scenario-store";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatetimePicker } from "@/components/ui/datetime-picker";
import { cn } from "@/lib/utils";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/date-picker";
import { useWatch, type Control, type Field } from "react-hook-form";
import { useEffect } from "react";
import { buildSchema, getDefaultValues } from "@/lib/zod-builder-3000";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";

type ControllerField<T extends BaseField> = {
  value: T["val"];
  onChange: (value: T["val"]) => void;
};

type FieldComponentProps<T extends BaseField = BaseField> = {
  controllerField: ControllerField<T>;
  field: T;
};

export const Fields = {
  textField: ({ controllerField, field }: FieldComponentProps<TextField>) => (
    <FormControl>
      <div>
        <FormLabel>{field.labels?.from}</FormLabel>
        <Input
          {...controllerField}
          type="text"
          placeholder={field.placeholder}
        />
      </div>
    </FormControl>
  ),

  numberField: ({
    controllerField,
    field,
  }: FieldComponentProps<NumberField>) => (
    <FormControl>
      <div className="flex items-center">
        <Input
          {...controllerField}
          type="number"
          min={field.min}
          max={field.max}
          placeholder={field.label}
          className={field.currency ? "rounded-r-none" : ""}
        />
        {field.currency && (
          <span className="px-2 py-2 border border-l-0 rounded-r-md text-muted-foreground text-sm bg-muted">
            {field.currency}
          </span>
        )}
      </div>
    </FormControl>
  ),

  dropdownField: ({
    controllerField,
    field,
  }: FieldComponentProps<DropdownField>) => (
    <Select
      onValueChange={controllerField.onChange}
      value={controllerField.value}
      defaultValue={controllerField.value}
    >
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${field.label}`} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {Array.isArray(field.options) &&
          field.options.map((option, index) => {
            const value = option.value;
            const label = option.label;

            return (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            );
          })}
      </SelectContent>
    </Select>
  ),

  MultiSelectSearchDropdownField: ({
    controllerField,
    field,
  }: FieldComponentProps<MultiSelectSearchDropdownField>) => (
    <FormControl>
      <MultiSelector
        values={controllerField.value}
        onValuesChange={(val) => {
          //console.log("clicked val: ", val);
          controllerField.onChange(val);

          //console.log("Field val: ", field.val);
          //console.log("controller : value ", controllerField.value);
        }}
        loop
        className="w-full"
      >
        <MultiSelectorTrigger>
          <MultiSelectorInput
            placeholder={field.placeholder}
            // value={controllerField.value}
          />
        </MultiSelectorTrigger>
        <MultiSelectorContent>
          <MultiSelectorList>
            {field.options.map((option) => (
              <MultiSelectorItem value={option.number} key={option.name}>
                {option.number} - {option.label}
              </MultiSelectorItem>
            ))}
          </MultiSelectorList>
        </MultiSelectorContent>
      </MultiSelector>
    </FormControl>
  ),

  dateTimeRangeField: ({
    controllerField,
    field,
  }: FieldComponentProps<DateTimeRangeField>) => {
    const value = controllerField.value ?? { from: null, to: null };

    function setRange(updated: Partial<typeof value>) {
      controllerField.onChange({ ...value, ...updated });
    }

    return (
      <div className="flex space-x-6 items-start">
        <FormItem className="flex flex-col flex-1">
          <FormLabel>{field.label?.from || "Start Date and Time"}</FormLabel>
          <FormControl>
            <DatetimePicker
              value={value.from}
              onChange={(date) => setRange({ from: date })}
              format={[
                ["days", "months", "years"],
                ["hours", "minutes", "am/pm"],
              ]}
              className={cn("w-fit")}
            />
          </FormControl>
          <FormDescription>
            {field.description || "Select the start date and time."}
          </FormDescription>
          <FormMessage>{field.error}</FormMessage>
        </FormItem>

        <FormItem className="flex flex-col flex-1">
          <FormLabel>{field.label || "End Date and Time"}</FormLabel>
          <FormControl>
            <DatetimePicker
              value={value.to}
              onChange={(date) => setRange({ to: date })}
              format={[
                ["days", "months", "years"],
                ["hours", "minutes", "am/pm"],
              ]}
              className={cn("w-fit")}
            />
          </FormControl>
          <FormDescription>
            {field.description || "Select the end date and time."}
          </FormDescription>
          <FormMessage>{field.error}</FormMessage>
        </FormItem>
      </div>
    );
  },

  numDateSelect: ({
    controllerField,
    field,
  }: FieldComponentProps<NumDateSelectField>) => {
    const value = controllerField.value ?? {
      amount: "",
      type: "both",
      dateRange: { from: undefined, to: undefined },
    };

    const setValue = (updated: Partial<typeof value>) =>
      controllerField.onChange({ ...value, ...updated });

    // Helper to update dateRange with partial updates
    function setDateRange(updated: Partial<typeof value.dateRange>) {
      setValue({ dateRange: { ...value.dateRange, ...updated } });
    }

    return (
      <div className="flex items-end gap-4">
        <FormControl className="w-1/4">
          <div className="flex items-center">
            <Input
              type="number"
              placeholder="Amount"
              value={value.number}
              onChange={(e) => setValue({ number: e.target.value })}
              className={field.currency ? "rounded-r-none" : ""}
            />
            {field.currency && (
              <span className="px-2 py-2 border border-l-0 rounded-r-md text-muted-foreground text-sm bg-muted">
                {field.currency}
              </span>
            )}
          </div>
        </FormControl>

        {/* Start DateTime Picker */}
        <FormControl className="w-1/4 flex flex-col">
          <div>
            <FormLabel>Start Date and Time</FormLabel>
            <DatetimePicker
              value={value.dateRange?.from}
              onChange={(date) => setDateRange({ from: date })}
              format={[
                ["days", "months", "years"],
                ["hours", "minutes", "am/pm"],
              ]}
              className="w-full"
            />
          </div>
        </FormControl>

        {/* End DateTime Picker */}
        <FormControl className="w-1/4 flex flex-col">
          <div>
            <FormLabel>End Date and Time</FormLabel>
            <DatetimePicker
              value={value.dateRange?.to}
              onChange={(date) => setDateRange({ to: date })}
              format={[
                ["days", "months", "years"],
                ["hours", "minutes", "am/pm"],
              ]}
              className="w-full"
            />
          </div>
        </FormControl>

        {/* Transaction Type Select */}
        <Select
          value={value.type}
          onValueChange={(val) => setValue({ type: val })}
          className="w-1/4"
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="received">Received</SelectItem>
            <SelectItem value="both">Both</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  },

  booleanField: ({
    controllerField,
    field,
  }: FieldComponentProps<BooleanField>) => {
    const value = controllerField.value ?? false;

    return (
      <FormControl className="flex items-center space-x-2">
        <label
          htmlFor={field.name}
          className="text-sm font-medium text-gray-700"
        >
          {field.label}
        </label>
        <Switch
          id={field.name}
          checked={value}
          onCheckedChange={(checked) => controllerField.onChange(checked)}
          className={`${
            value ? "bg-blue-600" : "bg-gray-200"
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span
            className={`${
              value ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
      </FormControl>
    );
  },

  doubleNumberField: ({
    controllerField,
    field,
  }: FieldComponentProps<DoubleNumberField>) => {
    const value = controllerField.value ?? { first: 0, second: 0 };

    const setValue = (updated: Partial<typeof value>) =>
      controllerField.onChange({ ...value, ...updated });

    return (
      <FormControl>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          {field.label}
        </label>
        <div className="flex space-x-4">
          {/* First number input */}
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-muted-foreground">
              {field.units?.first ? field.units.first : "First Value"}
            </span>
            <div className="flex items-center space-x-1">
              <Input
                type="number"
                value={value.first}
                min={field.min}
                max={field.max}
                onChange={(e) =>
                  setValue({ first: parseFloat(e.target.value) })
                }
                placeholder="From"
              />
            </div>
          </div>

          {/* Second number input */}
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-muted-foreground">
              {field.units?.second ? field.units.second : "Second Value"}
            </span>
            <div className="flex items-center space-x-1">
              <Input
                type="number"
                value={value.second}
                min={field.min}
                max={field.max}
                onChange={(e) =>
                  setValue({ second: parseFloat(e.target.value) })
                }
                placeholder="To"
              />
            </div>
          </div>
        </div>
      </FormControl>
    );
  },

  numberDateTimeRange: ({
    controllerField,
    field,
  }: FieldComponentProps<NumberDateTimeRangeField>) => {
    const value = controllerField.value ?? {
      number: 0,
      dateTimeRange: { from: null, to: null },
    };

    const setValue = (updated: Partial<typeof value>) =>
      controllerField.onChange({ ...value, ...updated });

    // Helper to update dateTimeRange partially
    function setDateTimeRange(updated: Partial<typeof value.dateTimeRange>) {
      setValue({ dateTimeRange: { ...value.dateTimeRange, ...updated } });
    }

    return (
      <div className="flex items-end gap-4">
        <FormControl className="w-1/4">
          <div className="flex items-center">
            <Input
              type="number"
              placeholder="Number"
              value={value.number}
              onChange={(e) => setValue({ number: Number(e.target.value) })}
              className={field.currency ? "rounded-r-none" : ""}
              min={field.min}
              max={field.max}
            />
            {field.currency && (
              <span className="px-2 py-2 border border-l-0 rounded-r-md text-muted-foreground text-sm bg-muted">
                {field.currency}
              </span>
            )}
          </div>
        </FormControl>

        {/* Start DateTime Picker */}
        <FormControl className="w-1/4 flex flex-col">
          <FormLabel>Start Date and Time</FormLabel>
          <DatetimePicker
            value={value.dateTimeRange?.from}
            onChange={(date) => setDateTimeRange({ from: date })}
            format={[
              ["days", "months", "years"],
              ["hours", "minutes", "am/pm"],
            ]}
            className="w-full"
          />
        </FormControl>

        {/* End DateTime Picker */}
        <FormControl className="w-1/4 flex flex-col">
          <FormLabel>End Date and Time</FormLabel>
          <DatetimePicker
            value={value.dateTimeRange?.to}
            onChange={(date) => setDateTimeRange({ to: date })}
            format={[
              ["days", "months", "years"],
              ["hours", "minutes", "am/pm"],
            ]}
            className="w-full"
          />
        </FormControl>
      </div>
    );
  },

  doubleNumberDateRange: ({
    controllerField,
    field,
  }: FieldComponentProps<DoubleNumberDateRangeField>) => {
    const value = controllerField.value ?? {
      firstNumber: 0,
      secondNumber: 0,
      dateRange: { from: null, to: null },
    };

    const setValue = (updated: Partial<typeof value>) =>
      controllerField.onChange({ ...value, ...updated });

    const setDateTimeRange = (updated: Partial<typeof value.dateRange>) =>
      setValue({ dateRange: { ...value.dateRange, ...updated } });

    return (
      <FormControl>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            {field.label}
          </label>

          <div className="flex space-x-4">
            {/* First input block */}
            <div className="flex flex-col flex-1">
              <label className="text-xs font-semibold text-gray-500 mb-1">
                {field.labels?.first ?? "First"}
              </label>
              <div className="flex items-center">
                <Input
                  type="number"
                  value={value.firstNumber}
                  min={field.minFirst}
                  max={field.maxFirst}
                  onChange={(e) =>
                    setValue({ firstNumber: parseFloat(e.target.value) || 0 })
                  }
                  placeholder={field.labels?.first ?? "First"}
                  className="rounded-r-none"
                />
                {field.units?.first && (
                  <span className="px-2 py-2 border border-l-0 rounded-r-md text-muted-foreground text-sm bg-muted">
                    {field.units.first}
                  </span>
                )}
              </div>
            </div>

            {/* Second input block */}
            <div className="flex flex-col flex-1">
              <label className="text-xs font-semibold text-gray-500 mb-1">
                {field.labels?.second ?? "Second"}
              </label>
              <div className="flex items-center">
                <Input
                  type="number"
                  value={value.secondNumber}
                  min={field.minSecond}
                  max={field.maxSecond}
                  onChange={(e) =>
                    setValue({ secondNumber: parseFloat(e.target.value) || 0 })
                  }
                  placeholder={field.labels?.second ?? "Second"}
                  className="rounded-r-none"
                />
                {field.units?.second && (
                  <span className="px-2 py-2 border border-l-0 rounded-r-md text-muted-foreground text-sm bg-muted">
                    {field.units.second}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* DateTime Range Pickers */}
          <div className="flex space-x-4 mt-4">
            <FormControl className="w-1/4 flex flex-col">
              <div>
                <FormLabel>Start Date and Time</FormLabel>
                <DatetimePicker
                  value={value.dateRange?.from}
                  onChange={(date) => setDateTimeRange({ from: date })}
                  format={[
                    ["days", "months", "years"],
                    ["hours", "minutes", "am/pm"],
                  ]}
                  className="w-full"
                />
              </div>
            </FormControl>

            <FormControl className="w-1/4 flex flex-col">
              <div>
                <FormLabel>End Date and Time</FormLabel>
                <DatetimePicker
                  value={value.dateRange?.to}
                  onChange={(date) => setDateTimeRange({ to: date })}
                  format={[
                    ["days", "months", "years"],
                    ["hours", "minutes", "am/pm"],
                  ]}
                  className="w-full"
                />
              </div>
            </FormControl>
          </div>
        </div>
      </FormControl>
    );
  },

  dateTimeField: ({
    controllerField,
    field,
  }: FieldComponentProps<DateTime>) => {
    return (
      <FormItem className="flex flex-col">
        <FormLabel>{field.label || "Select Date and Time"}</FormLabel>
        <FormControl>
          <DatetimePicker
            value={controllerField.value}
            onChange={(date) => controllerField.onChange(date)}
            format={[
              ["days", "months", "years"],
              ["hours", "minutes", "am/pm"],
            ]}
            className="w-fit"
          />
        </FormControl>
        <FormDescription>
          {field.description || "Choose a date and time."}
        </FormDescription>
        <FormMessage>{field.error}</FormMessage>
      </FormItem>
    );
  },

  dateField: ({ controllerField, field }: FieldComponentProps<DateField>) => {
    return (
      <FormItem className="flex flex-col">
        <FormControl>
          <DatePicker
            value={controllerField.value || null}
            onChange={(date) => controllerField.onChange(date)}
            format={[["days", "months", "years"]]}
            className="w-fit"
          />
        </FormControl>
        <FormDescription>
          {field.description || "Choose a date and time."}
        </FormDescription>
        <FormMessage>{field.error}</FormMessage>
      </FormItem>
    );
  },

  badgeSelectField: ({
    controllerField,
    field,
  }: FieldComponentProps<BadgeSelectType>) => {
    // Make sure controllerField.value is always an array
    const selectedValues: string[] = Array.isArray(controllerField.value)
      ? controllerField.value
      : [];

    const toggleOption = (optionName: string) => {
      if (selectedValues.includes(optionName)) {
        controllerField.onChange(
          selectedValues.filter((v) => v !== optionName),
        );
      } else {
        controllerField.onChange([...selectedValues, optionName]);
      }
    };

    return (
      <FormItem className="flex flex-col gap-2">
        {/* <FormLabel>{field.label || "Select options"}</FormLabel> */}
        <FormControl>
          <div className="flex flex-wrap gap-2">
            {field.options.map((option) => {
              const isSelected = selectedValues.includes(option.name);
              return (
                <Button
                  key={option.name}
                  type="button"
                  onClick={() => toggleOption(option.name)}
                  className={`px-3 py-1 rounded-full border text-sm transition-transform duration-200 ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 transform scale-105"
                      : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100 hover:scale-110"
                  }`}
                >
                  {option.label}
                </Button>
              );
            })}
          </div>
        </FormControl>
        <FormDescription>
          {field.description || "Click to select one or more options."}
        </FormDescription>
        <FormMessage>{field.error}</FormMessage>
      </FormItem>
    );
  },

  dateTimeDurationField: ({
    controllerField,
    field,
  }: FieldComponentProps<DateTimeDuration>) => {
    return (
      <FormItem className="flex flex-col">
        <FormControl>
          <div>
            <DatetimePicker
              value={controllerField.value}
              onChange={(date) => controllerField.onChange(date)}
              format={[
                ["days", "months", "years"],
                ["hours", "minutes"],
              ]}
              className="w-fit"
            />
            <p>
              {(() => {
                const d = controllerField.value;
                if (!d) return "No duration set";

                const years = d.getFullYear();
                const months = d.getMonth();
                const days = d.getDay();
                const hours = d.getHours();
                const minutes = d.getMinutes();
                const parts = [];
                if (years) parts.push(`${years} year${years > 1 ? "s" : ""}`);
                if (months)
                  parts.push(`${months} month${months > 1 ? "s" : ""}`);
                if (days) parts.push(`${days} day${days > 1 ? "s" : ""}`);
                if (hours) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
                if (minutes)
                  parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);

                return parts.length > 0 ? parts.join(", ") : "0 duration";
              })()}
            </p>
          </div>
        </FormControl>
        <FormDescription>
          {field.description || "Select the datetime representing duration."}
        </FormDescription>
        <FormMessage>{field.error}</FormMessage>
      </FormItem>
    );
  },
};

type FilterListFormProps = {
  compositeKey: string;
  title: string;
  fields: Field[];
  registerForm: (
    compositeKey: string,
    form: ReturnType<typeof useForm>,
  ) => void;
};

function FilterFieldWatcher({
  control,
  name,
  category,
  medium,
}: {
  control: Control<any>;
  name: string;
  category: string;
  medium?: string;
}) {
  const value = useWatch({ control, name });
  const { updateFieldValues } = ScenarioStore();

  useEffect(() => {
    // Update when value changes
    updateFieldValues(category, name, value, medium);

    // Save one last time on unmount
    return () => {
      updateFieldValues(category, name, value, medium);
    };
  }, [value]);

  return null;
}

export function FilterListForm({
  compositeKey,
  title,
  fields,
  registerForm,
}: FilterListFormProps) {
  const schema = useMemo(() => buildSchema(fields), []);
  const defaultValues = useMemo(() => getDefaultValues(fields), []);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });
  //console.log("Schema was updated: ", schema);
  //console.log("default values: ", defaultValues);

  useEffect(() => {
    registerForm(compositeKey, form);
  }, [compositeKey, form, registerForm]);

  const [category, medium] = compositeKey.split(":");

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle hidden>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            {fields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: controllerField }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    {field.description && (
                      <FormDescription>{field.description}</FormDescription>
                    )}
                    {/* 👇 Watch each field's value and update store */}
                    <FilterFieldWatcher
                      control={form.control}
                      name={field.name}
                      category={category}
                      medium={medium}
                    />
                    {field.type === "dropdown" ? (
                      <Fields.dropdownField
                        controllerField={controllerField}
                        field={field}
                      />
                    ) : field.type === "text" ? (
                      <Fields.textField
                        controllerField={controllerField}
                        field={field}
                      />
                    ) : field.type === "number" ? (
                      <Fields.numberField
                        controllerField={controllerField}
                        field={field}
                      />
                    ) : field.type === "numDateSelect" ? (
                      <Fields.numDateSelect
                        controllerField={controllerField}
                        field={field}
                      />
                    ) : field.type === "date" ? (
                      <Fields.dateField
                        controllerField={controllerField}
                        field={field}
                      />
                    ) : field.type === "boolean" ? (
                      <Fields.booleanField
                        controllerField={controllerField}
                        field={field}
                      />
                    ) : field.type === "dateTimeRange" ? (
                      <Fields.dateTimeRangeField
                        controllerField={controllerField}
                        field={field}
                      />
                    ) : field.type === "doubleNumberDateRange" ? (
                      <Fields.doubleNumberDateRange
                        controllerField={controllerField}
                        field={field}
                      />
                    ) : field.type === "datetime" ? (
                      <Fields.dateTimeField
                        controllerField={controllerField}
                        field={field}
                      />
                    ) : field.type === "dateTimeDuration" ? (
                      <Fields.dateTimeDurationField
                        controllerField={controllerField}
                        field={field}
                      />
                    ) : field.type === "multiselectsearchdropdown" ? (
                      <Fields.MultiSelectSearchDropdownField
                        controllerField={controllerField}
                        field={field}
                      />
                    ) : field.type === "badgeselect" ? (
                      <Fields.badgeSelectField
                        controllerField={controllerField}
                        field={field}
                      />
                    ) : null}
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

type FilterListProps = {
  category: string;
  data:
    | {
        fields: Field[];
      }
    | {
        [key in TransactionMedium]?: {
          fields: Field[];
        };
      };
  registerForm: (
    compositeKey: string,
    form: ReturnType<typeof import("react-hook-form").useForm>,
  ) => void;
};

export function FilterList({ category, data, registerForm }: FilterListProps) {
  // Memoize the rendering data based on category and data
  const memoizedForms = useMemo(() => {
    if ("fields" in data) {
      // Single form case
      return (
        <FilterListForm
          compositeKey={category}
          title={category}
          fields={data.fields}
          registerForm={registerForm}
        />
      );
    }

    // Multiple forms per medium
    return (
      <div className="space-y-4">
        {Object.entries(data).map(([medium, mediumData]) => {
          const compositeKey = `${category}:${medium}`;
          const title =
            `${category.charAt(0).toUpperCase() + category.slice(1)} - ` +
            `${medium.charAt(0).toUpperCase() + medium.slice(1)}`;
          const fields = mediumData?.fields ?? [];

          return (
            <FilterListForm
              key={compositeKey}
              compositeKey={compositeKey}
              title={title}
              fields={fields}
              registerForm={registerForm}
            />
          );
        })}
      </div>
    );
  }, [category, data, registerForm]);

  return memoizedForms;
}
